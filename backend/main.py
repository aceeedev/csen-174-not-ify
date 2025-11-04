from flask import Flask, jsonify, request
from flask_cors import CORS

from FireStoreInterface import FirebaseManager
from spotifyInterface import SpotifyManager

from models.group import Group, GroupMemberData, PostedPlaylist
from models.playlist import Playlist
from models.song import Song
from models.user import User

from datetime import datetime, timedelta, timezone

app = Flask(__name__)
CORS(app)


def validate_params(required_params: list[str]):
    missing = [p for p in required_params if not request.args.get(p)]

    if missing:
        return jsonify({
            "error": f"Missing required parameter(s): {', '.join(missing)}"
        }), 400
    
    return None

@app.route('/spotify/auth-url')
def get_auth_url():    
    spotify = SpotifyManager()

    auth_url: str = spotify.get_auth_url()

    return jsonify({'auth_url': auth_url}) 

@app.route('/spotify/auth-callback')
@FirebaseManager.require_firebase_auth
def auth_callback():
    error = validate_params(['code'])
    if error:
        return error
    
    user_id = request.user_id
    code: str = request.args.get("code")

    spotify = SpotifyManager()

    access_token: str = spotify.get_access_token(code)
    
    # Add user to firebase
    firebase = FirebaseManager()

    firebase_user = firebase.get_firebase_user_info(user_id)

    user = User(
        name=firebase_user.display_name,
        spotify_id="", # TODO: get from spotify_manager
        access_token=access_token,
        profile_pic=firebase_user.photo_url,
        library=[],
        my_groups=[],
        my_complaints=[],
        is_admin=False
    )

    firebase.create_user(user_id, user)

    return jsonify({"message": "Success!"}), 200


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

### Endpoint Functions ###
    
#TODO: Get current groups -- endpoint
@app.route('/get/groups')
def get_groups():
    userID: str = request.args.get("userID") #also owner ID
    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    
    #return the list of all groups that user userID is a member of
    raise NotImplementedError

#TODO: Create Group -- endpoint
@app.route('/create/group')
def create_group():
    fb = FirebaseManager()
    userID: str = request.args.get("userID") #also owner ID
    groupName: str = request.args.get("groupName")
    description: str = request.args.get("description")

    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    if not groupName:
        return jsonify({"error": "Missing groupName parameter"}), 400
    if not description:
        return jsonify({"error": "Missing description parameter"}), 400
    
    #Make group object from group.py in models
    ownersMemberData = GroupMemberData.default()
    newGroup = Group(userID, [], description, groupName, {userID:ownersMemberData}) #default

    #Make group using firebase call, passing the object group
    fb.create_group(newGroup)
    print("Group {groupName} successfully created by user {userID}")


@app.route('/join/group')
@FirebaseManager.require_firebase_auth
def join_group():
    error = validate_params(["group_id"])
    if error:
        return error

    user_id: str = request.user_id
    group_id: str = request.args.get("group_id")


    # get firebase objects
    firebase = FirebaseManager()

    group = firebase.get_group_info(group_id)
    user = firebase.get_user_info(user_id)

    # check to see if the user is already a member of the group
    if user_id in group.member_ids:
        return jsonify({"error": "User already member of this group"}), 400
    
    # check to see if the group is full
    if len(group.member_ids) >= group.maxMembers:
        return jsonify({"error": "This group has already reached the max number of members"}), 400
    
    # add the user to the group
    group.member_ids.append(user_id)
    group.group_member_data[user_id] = GroupMemberData.default()

    user.my_groups.append(group_id)

    # update the firebase objects
    firebase.update_group(group_id, group)
    firebase.update_user(user_id, user)

@app.route('/edit/group')
@FirebaseManager.require_firebase_auth
def edit_group():
    fb = FirebaseManager()

    # userID: str = request.args.get("userID")
    error = validate_params(["groupID", "action", "params"])
    if error:
        return error
    
    userID: str = request.user_id
    groupID: str = request.args.get("groupID")
    action: str = request.args.get("action")
    params: str = request.args.get("params")

    fGroup = fb.get_group_info(groupID)
    #error handling needed if the group does not exist
    fUser = fb.get_user_info(userID)
    #error handling needed if the user does not exist

    #Check if the userID == group owner ID
    if userID != fGroup.owner_id:
        return jsonify({"error": "Access denied, user is not the owner"}), 400
    
    #If actions == remove_user: remove user from group functionality:
    if action == 'remove_user':
        if groupID not in fUser.my_groups:
            return jsonify({"error": "Implementation error, cannot access a group you are not in"}), 400
        if params == userID: 
            return jsonify({"error": "Implementation error, cannot remove yourself"}), 400
        if params not in fGroup.member_ids:
            return jsonify({"error": "Implementation error, cannot remove a member that is not in the group"}), 400
        
        fParams = fb.get_user_info(params)
        if groupID not in fParams.my_groups:
            return jsonify({"error": "Data continuity error: member does not claim to be in group, though group claims that user."}), 400
        fParams.my_groups.remove(groupID)
        fb.update_user(params, fParams)

        fGroup.member_ids.remove(params)
        fb.update_group(groupID, fGroup)
        
        print("User with userID {params} successfully removed from group with groupID {groupID}")
        return 200
    
    #If actions == del_group: deleting the group functionality
    elif action == 'del_group':
        #remove groupID from the member's myGroup's array
        for member in fGroup.member_ids:
            fMember = fb.get_user_info(member)
            if groupID not in fMember.my_groups:
                return jsonify({"error": "Data continuity error: member does not claim to be in group, though group claims that user."}), 400
            fMember.my_groups.remove(groupID)
            fb.update_user(member, fMember)

        #Delete the group from the firebase
        fb.delete_group(groupID)
        print("Group with groupID: {groupID} successfully deleted")
        return 200
    else:
        return jsonify({"error": "Selected action is not provided"}), 400

@app.route('/get/users/playlists') #Getting spotify playlists, as opposed to get library 
def get_users_playlists():
    userID: str = request.args.get("userID")

    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    
    #Get the spotify user ID from the firebase
    #With the access token, go to spotify and retrive all of those user's playlists
    #Pass those spotify playlists to our converter and get them as instances of our playlist object
    #Return those playlists

    raise NotImplementedError

@app.route('/add/playlist/group')
@FirebaseManager.require_firebase_auth
def add_playlist_to_group():
    error = validate_params(['code'])
    if error:
        return error
    
    user_id = request.user_id

    group_id: str = request.args.get("group_id")
    spotify_playlist_id: str = request.args.get("spotify_playlist_id")

    # get user and group from firebase
    firebase = FirebaseManager()

    user = firebase.get_user_info(user_id)
    group = firebase.get_group_info(group_id)


    # check if last post was at least 24 hours ago
    now = datetime.now(timezone.utc)

    if now - group.group_member_data[user_id].last_posting_timestamp <= timedelta(hours=24):
        return jsonify({"error": "User has already posted within the last 24 hours"}), 400

    # get spotify playlist info
    spotify = SpotifyManager()

    playlist = spotify.get_playlist_info(user.access_token, spotify_playlist_id)

    # add playlist info to firebase
    playlist = Playlist(
        spotify_id=spotify_playlist_id,
        owner_id=user_id,
        title=playlist["name"],
        cover=playlist["images"][-1]["url"],
        description=playlist["description"],
        songs=[]
    )

    # add all the songs into the playlist
    for spotify_song in playlist["tracks"]["items"]:
        # check if this song has already been added to the firebase
        spotify_song_id = spotify_song["id"]
        try:
            firebase.get_song_info(spotify_song_id)
        except ValueError:
            song = Song(
                spotify_id=spotify_song_id,
                album_cover=spotify_song["album"]["images"][-1]["url"],
                album_name=spotify_song["album"]["name"],
                artist_name=", ".join([artist_data["name"] for artist_data in spotify_song["artists"]]),
                title=spotify_song["name"]
            )

            firebase.create_song(spotify_song_id, song)

        playlist.songs.extend(spotify_song_id)


    # update group with playlist info
    playlist_id = firebase.create_playlist(playlist)
    
    group.group_member_data[user_id].posted_playlists.extend(PostedPlaylist(
        playlist_id=playlist_id,
        number_downloaded=0
    ))

    firebase.update_group(group_id, group)
@app.route('/take/playlist/group')
@FirebaseManager.require_firebase_auth
def take_playlist_from_group():
    fb = FirebaseManager()
    error = validate_params(["groupID", "action", "params"])
    if error:
        return error

    userID: str = request.user_id
    groupID: str = request.ags.get("groupID")
    playlistID: str = request.args.get("playlistID")
    


### Class Functions ###

##Transfered From Group.py##
def inviteMember(self: Group, callerID: str, inviteeID: str):
    #Error Handling
    errorCaught: bool = False
    if callerID not in self.memberIDs:
        raise Exception("User {callerID} is not a member of group {self.groupName}")
        errorCaught = True
    if inviteeID in self.memberIDs: 
        raise Exception("User {inviteeID} is already a member of group {self.groupName}")
        errorCaught = True
    if len(self.memberIDs) == self.maxMembers:
        raise Exception("Group is already at maximum capacity, cannot add more members.")
        errorCaught = True
    if errorCaught: #Allows for multiple failure to be displayed. 
        return
    
    self.memberIDs.append(inviteeID) #add user

def add_to_shelf(self: Group, playlist): #UC1
    if playlist not in self.shelf:
        self.shelf.append(playlist)


def take_down_plist(self: Group, playlist): #UC1
    if playlist not in self.shelf:
        raise Exception("Cannot remove playlist that is not on the shelf.")
        errorCaught = True
    else:
        self.shelf.remove(playlist)

##Transferred from Playlist.py##
def add_to_library(self: Playlist, user): #UC1
    if self not in user.library:
        user.save_playlist(self)
    else:
        raise Exception("User {user} already has a copy of {self.title}")
        errorCaught = True


def export_to_spotify(self: Playlist, spotify_client):
    """Export the playlist to Spotify using the provided Spotify client."""
    pass

def get_playlist(self: Playlist):
    return self

def add_song(self: Playlist, song: Song):
    if song not in self.songs:
        self.songs.append(song)

def remove_song(self: Playlist, song: Song):
    self.songs = [obj for obj in self.songs if obj != song]


def change_cover(self: Playlist, new_cover: str):
    self.cover = new_cover

def change_title(self: Playlist, new_title: str):
    self.title = new_title

## From user.py ##

def spotify_login(self: User, spotify_user):
    pass

def respond_to_complaint(self: User, complaint_id: str, response: str, action: str) -> bool:
    return self.isAdmin

'''
def create_complaint(self, complaint: AdminComplaint):
    self.myComplaints.append(complaint)
'''

def remove_complaint(self: User, id: str):
    # create a new array with all complaints except the one with the given id
    self.myComplaints = [obj for obj in self.myComplaints if obj.id != id]

def save_playlist(self: User, playlist):
    self.library.append(playlist) #UC1. User has playlist relationship checked in playlist
