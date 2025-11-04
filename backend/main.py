from flask import Flask, jsonify, request
from flask_cors import CORS

from FireStoreInterface import FirebaseManager
from spotifyInterface import SpotifyManager

from models.group import Group
from models.playlist import Playlist
from models.song import Song
from models.user import User

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/data')
def get_data():
    data = {
        "name": "Alice",
        "age": 30,
        "city": "New York"
    }
    return jsonify(data)

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

@app.route('/spotify/auth-callback') #function name
@FirebaseManager.require_firebase_auth
def auth_callback(): #definition
    error = validate_params(['code'])
    if error: #error handling
        return error
    
    code: str = request.args.get("code") #parameters

    spotify = SpotifyManager() #Logic

    access_token: str = spotify.get_access_token(code)
    print(access_token)
    
    # add access token under user in firebase

    return jsonify({'access_token': access_token}) 


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
    userID: str = request.args.get("userID") #also owner ID
    groupName: str = request.args.get("groupName")
    description: str = request.args.get("description")

    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    if not groupName:
        return jsonify({"error": "Missing groupName parameter"}), 400
    if not description:
        return jsonify({"error": "Missing description parameter"}), 400
    
    raise NotImplementedError
    #Make group using firebase call


#TODO: Join Group -- endpoint
@app.route('/join/group')
def join_group():
    userID: str = request.args.get("userID")
    groupID: str = request.args.get("groupID")

    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    if not groupID:
        return jsonify({"error": "Missing groupID parameter"}), 400
    
    #Access the list of group's members
    #Check to see if the requesting user is a member of the group - error if false
    #Check to see if the group is full - error if true
    #Check and see if the user is already a member - error if true
    #Add the new user ID to the group 
    #return completed

    raise NotImplementedError

#TODO: edit group
@app.route('/remove/group')
def edit_group():
    userID: str = request.args.get("userID")
    groupID: str = request.args.get("groupID")
    action: str = request.args.get("action")
    params: str = request.args.get("params")

    if not userID:
        return jsonify({"error": "Missing userID parameter"}), 400
    if not groupID:
        return jsonify({"error": "Missing groupID parameter"}), 400
    if not action:
        return jsonify({"error": "Missing action parameter"}), 400   
    if not params and action != "remove_user":
        return jsonify({"error": "Missing params parameter"}), 400
    
    #Check if the userID == group owner ID
    #Parse the action parameter and determine if it is 'remove_user' or 'del_group'
    #If actions == remove_user: remove user from group functionality:
        #Params = the userID of the user we want to remove
        #params != ownerID (Can't remove the owner)
        #Find userID=params in the group provided by groupID's members array
        #Remove that user from the array.
    #If actions == del_group: deleting the group functionality
        #Go to the group referenced by groupID
        #for each user in group's members array:
            #remove groupID from the member's myGroup's array
        #Delete the group from the firebase
    
    raise NotImplementedError

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
def add_playlist_to_group():
    userID: str = request.args.get("userID")
    groupID: str = request.args.get("groupID")
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
