from flask import Flask, jsonify, request
from flask_cors import CORS

from FireStoreInterface import FirebaseManager
from spotifyInterface import SpotifyManager, SpotifyAccessTokenInfo

from models.group import Group, GroupMemberData, PostedPlaylist
from models.playlist import Playlist
from models.song import Song
from models.user import User

from datetime import datetime, timedelta, timezone
import random
import string

app = Flask(__name__)
CORS(app)


def generate_invite_code(length: int = 6) -> str:
    """
    Generates a unique invite code similar to Kahoot game codes.
    Uses uppercase letters and numbers, excluding confusing characters (0, O, I, 1).
    
    Args:
        length (int): Length of the code (default 6)
    
    Returns:
        str: A random invite code
    """
    # Use characters that are easy to distinguish: A-Z (excluding I, O), 2-9
    chars = string.ascii_uppercase.replace('I', '').replace('O', '') + '23456789'
    return ''.join(random.choice(chars) for _ in range(length))


def validate_params(required_params: list[str]):
    missing = [p for p in required_params if not request.args.get(p)]

    if missing:
        return jsonify({
            "error": f"Missing required parameter(s): {', '.join(missing)}"
        }), 400
    
    return None


@app.route('/spotify/auth-url')
def get_auth_url():
    try:
        spotify = SpotifyManager()

        auth_url: str = spotify.get_auth_url()
        
        print(f"Generated Spotify auth URL (full): {auth_url}")  # Log full URL for debugging
        print(f"URL length: {len(auth_url)}")
        
        if not auth_url or not auth_url.startswith('http'):
            raise ValueError(f"Invalid auth URL generated: {auth_url}")

        return jsonify({'auth_url': auth_url})
    except Exception as e:
        print(f"Error generating Spotify auth URL: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to generate auth URL: {str(e)}'}), 500 

@app.route('/spotify/auth-callback')
@FirebaseManager.require_firebase_auth
def auth_callback():
    try:
        error = validate_params(['code'])
        if error:
            print(f"Missing code parameter in callback")
            return error
        
        user_id = request.user_id
        code: str = request.args.get("code")
        
        print(f"Received Spotify callback for user {user_id}, code: {code[:20]}...")

        spotify = SpotifyManager()

        print("Exchanging code for access token...")
        access_token_info: SpotifyAccessTokenInfo = spotify.get_access_token(code)
        print("Successfully got access token")

        # sub 60 seconds to be safe
        safe_access_token_expire_time: datetime = datetime.now() + timedelta(seconds=access_token_info.expires_in - 60)
        
        # Add or update user in firebase
        firebase = FirebaseManager()

        firebase_user = firebase.get_firebase_user_info(user_id)

        # Check if user already exists
        try:
            existing_user = firebase.get_user_info(user_id)
            # User exists - update only Spotify tokens and preserve existing data
            existing_user.access_token = access_token_info.access_token
            existing_user.refresh_token = access_token_info.refresh_token
            existing_user.access_token_expires = safe_access_token_expire_time
            # Update name and profile pic in case they changed
            existing_user.name = firebase_user.display_name
            existing_user.profile_pic = firebase_user.photo_url
            firebase.update_user(user_id, existing_user)
            print(f"Successfully updated existing user {user_id} with Spotify tokens")
        except ValueError:
            # User doesn't exist - create new user
            user = User(
                name=firebase_user.display_name,
                spotify_id="", # TODO: get from spotify_manager
                access_token=access_token_info.access_token,
                refresh_token=access_token_info.refresh_token,
                access_token_expires=safe_access_token_expire_time,
                profile_pic=firebase_user.photo_url,
                library=[],
                my_groups=[],
                my_complaints=[],
                is_admin=False
            )
            firebase.create_user(user_id, user)
            print(f"Successfully created new user {user_id} with Spotify tokens")

        return jsonify({"message": "Success!"}), 200
    
    except Exception as e:
        print(f"Error in Spotify auth callback: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to process callback: {str(e)}"}), 500
    
@app.route('/get/groups')
@FirebaseManager.require_firebase_auth
def get_groups():
    #return the list of all groups that user user_id is a member of
    user_id = request.user_id
    firebase = FirebaseManager()

    firebase_user = firebase.get_user_info(user_id)
    output_lists = [] #empty list to store the output

    for group_id in firebase_user.my_groups:
        output_lists.append(firebase.get_group_info(group_id).to_dict_with_id(group_id))
    
    return jsonify({"data": output_lists}), 200

@app.route('/create/group')
@FirebaseManager.require_firebase_auth
def create_group():
    error = validate_params(['group_name', 'description'])
    if error:
        return error

    firebase = FirebaseManager()

    user_id: str = request.user_id
    group_name: str = request.args.get("group_name")
    description: str = request.args.get("description")
    
    # Generate unique invite code
    invite_code = generate_invite_code()
    
    # Ensure code is unique (check if it exists, regenerate if needed)
    max_attempts = 10
    for _ in range(max_attempts):
        # Check if code already exists by querying groups
        all_groups = firebase.get_collection("Groups")
        code_exists = any(group.get('invite_code') == invite_code for group in all_groups)
        if not code_exists:
            break
        invite_code = generate_invite_code()
    else:
        # If we couldn't generate a unique code after max attempts, use a longer one
        invite_code = generate_invite_code(length=8)
    
    #Make group object from group.py in models
    ownersMemberData = GroupMemberData.default()
    newGroup = Group(
        owner_id=user_id, 
        member_ids=[user_id], 
        description=description,
        group_name=group_name, 
        group_member_data={
            user_id: ownersMemberData
        },
        invite_code=invite_code
    ) #default

    #Make group using firebase call, passing the object group
    group_id = firebase.create_group(newGroup)

    # add group id to the user's groups
    user = firebase.get_user_info(user_id)
    user.my_groups.append(group_id)

    firebase.update_user(user_id, user)

    print("Group {group_name} successfully created by user {user_id}")

    return jsonify({"message": "Success!"}), 200

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
    if len(group.member_ids) >= group.max_members:
        return jsonify({"error": "This group has already reached the max number of members"}), 400
    
    # add the user to the group
    group.member_ids.append(user_id)
    group.group_member_data[user_id] = GroupMemberData.default()

    user.my_groups.append(group_id)

    # update the firebase objects
    firebase.update_group(group_id, group)
    firebase.update_user(user_id, user)

    return jsonify({"message": "Success!"}), 200

@app.route('/join/group/by-code')
@FirebaseManager.require_firebase_auth
def join_group_by_code():
    """
    Join a group using an invite code (Kahoot-style).
    """
    error = validate_params(["invite_code"])
    if error:
        return error

    user_id: str = request.user_id
    invite_code: str = request.args.get("invite_code").upper().strip()  # Normalize to uppercase

    firebase = FirebaseManager()
    
    # Find group by invite code
    all_groups = firebase.get_collection("Groups")
    group_data = None
    group_id = None
    
    for group in all_groups:
        if group.get('invite_code') == invite_code:
            group_data = group
            group_id = group.get('id')
            break
    
    if not group_data or not group_id:
        return jsonify({"error": "Invalid invite code"}), 404
    
    # Get group object
    group = firebase.get_group_info(group_id)
    user = firebase.get_user_info(user_id)

    # Check if the user is already a member of the group
    if user_id in group.member_ids:
        return jsonify({"error": "You are already a member of this group"}), 400
    
    # Check if the group is full
    if len(group.member_ids) >= group.max_members:
        return jsonify({"error": "This group has reached the maximum number of members"}), 400
    
    # Add the user to the group
    group.member_ids.append(user_id)
    group.group_member_data[user_id] = GroupMemberData.default()

    user.my_groups.append(group_id)

    # Update the firebase objects
    firebase.update_group(group_id, group)
    firebase.update_user(user_id, user)

    return jsonify({"message": "Success!", "group_id": group_id, "group_name": group.group_name}), 200

@app.route('/get/group/invite-code')
@FirebaseManager.require_firebase_auth
def get_group_invite_code():
    """
    Get the invite code for a group.
    """
    error = validate_params(["group_id"])
    if error:
        return error
    
    user_id: str = request.user_id
    group_id: str = request.args.get("group_id")
    
    firebase = FirebaseManager()
    group = firebase.get_group_info(group_id)
    
    # Verify user is a member of the group
    if user_id not in group.member_ids:
        return jsonify({"error": "You must be a member of the group to view the invite code"}), 403
    
    return jsonify({"invite_code": group.invite_code}), 200

@app.route('/invite/group')
@FirebaseManager.require_firebase_auth
def invite_to_group():
    error = validate_params(['group_id', 'invitee_user_id'])
    if error:
        return error
    
    inviter_id: str = request.user_id
    group_id: str = request.args.get("group_id")
    invitee_user_id: str = request.args.get("invitee_user_id")
    
    firebase = FirebaseManager()
    
    # Get group and verify inviter is a member
    group = firebase.get_group_info(group_id)
    
    if inviter_id not in group.member_ids:
        return jsonify({"error": "You must be a member of the group to invite others"}), 400
    
    # Check if invitee is already a member
    if invitee_user_id in group.member_ids:
        return jsonify({"error": "User is already a member of this group"}), 400
    
    # Check if group is full
    if len(group.member_ids) >= group.max_members:
        return jsonify({"error": "This group has reached the maximum number of members"}), 400
    
    # Check if invitee user exists
    try:
        invitee_user = firebase.get_user_info(invitee_user_id)
    except ValueError:
        return jsonify({"error": "User not found"}), 404
    
    # Add invitee to group using helper functions
    group.member_ids.append(invitee_user_id)
    group.group_member_data[invitee_user_id] = GroupMemberData.default()
    firebase.update_group(group_id, group)
    
    # Add group to invitee's my_groups list
    invitee_user.my_groups.append(group_id)
    firebase.update_user(invitee_user_id, invitee_user)
    
    return jsonify({"message": "Success!"}), 200

@app.route('/edit/group')
@FirebaseManager.require_firebase_auth
def edit_group():
    firebase = FirebaseManager()

    # Validate required params (params is optional for del_group)
    error = validate_params(["groupID", "action"])
    if error:
        return error
    
    user_id: str = request.user_id
    group_id: str = request.args.get("groupID")
    action: str = request.args.get("action")
    params: str = request.args.get("params", "")  # Default to empty string if not provided

    firebase_group = firebase.get_group_info(group_id)
    firebase_user = firebase.get_user_info(user_id)
    
    #If actions == remove_user: remove user from group functionality:
    if action == 'remove_user':
        # Validate params is provided for remove_user
        if not params:
            return jsonify({"error": "Missing required parameter: params (user ID to remove)"}), 400
        
        #If a general user wants to remove themselves, allow them to
        if params == firebase_group.owner_id: 
            return jsonify({"error": "Implementation error, cannot remove the group owner"}), 400
        if params != user_id and user_id != firebase_group.owner_id:
            return jsonify({"error": "Cannot remove another user if you are not the owner"}), 400   
        if group_id not in firebase_user.my_groups:
            return jsonify({"error": "Implementation error, cannot access a group you are not in"}), 400
        if params not in firebase_group.member_ids:
            return jsonify({"error": "Implementation error, cannot remove a member that is not in the group"}), 400
        
        firebase_params = firebase.get_user_info(params)
        if group_id not in firebase_params.my_groups:
            return jsonify({"error": "Data continuity error: member does not claim to be in group, though group claims that user."}), 400
        firebase_params.my_groups.remove(group_id)
        firebase.update_user(params, firebase_params)

        firebase_group.member_ids.remove(params)
        del firebase_group.group_member_data[params] #delete the removed user's data, not the caller's
        firebase.update_group(group_id, firebase_group)
        
        print(f"User with user_id {params} successfully removed from group with group_id {group_id}")
        return jsonify({"message": "Success!"}), 200
    
    #If actions == update_settings: update group name/description
    #Unsure of what this does, or where params = json is generated from.
    #It may be better if there is a separate endpoint called update_group that has these parameters. 
    elif action == 'update_settings':
        # Validate params is provided for update_settings
        if not params:
            return jsonify({"error": "Missing required parameter: params (JSON settings)"}), 400
        
        if user_id != firebase_group.owner_id:
            return jsonify({"error": "Access denied, user is not the owner"}), 400
        
        # params should be JSON string with group_name and/or description
        import json
        try:
            settings = json.loads(params)
            if 'group_name' in settings:
                firebase_group.group_name = settings['group_name']
            if 'description' in settings:
                firebase_group.description = settings['description']
            if 'max_members' in settings:
                firebase_group.max_members = int(settings['max_members'])
            if 'max_playlists' in settings:
                firebase_group.max_playlists = int(settings['max_playlists'])
            
            firebase.update_group(group_id, firebase_group)
            return jsonify({"message": "Success!"}), 200
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON in params"}), 400
    
    #If actions == del_group: deleting the group functionality
    elif action == 'del_group':
        # Verify user is the owner
        if user_id != firebase_group.owner_id:
            return jsonify({"error": "Access denied, user is not the owner"}), 400
        
        # Delete the group (cleanup is handled internally by delete_group)
        firebase.delete_group(group_id)
        
        print(f"Group with groupID: {group_id} successfully deleted")
        return jsonify({"message": "Success!"}), 200
    
    else:
        return jsonify({"error": "Selected action is not provided"}), 400

@app.route('/get/group/members/list')
@FirebaseManager.require_firebase_auth
def get_group_members_list():
    firebase = FirebaseManager()

    error = validate_params(["group_id"])
    if error:
        return error
    
    user_id: str = request.user_id
    group_id: str = request.args.get("group_id")

    firebase_group = firebase.get_group_info(group_id)
    firebase_user = firebase.get_user_info(user_id)

    if group_id not in firebase_user.my_groups:
        return jsonify({"error": "Implementation error, cannot access a group you are not in"}), 400        

    firebase_members = [firebase.get_user_info(member_id).to_dict() for member_id in firebase_group.member_ids]

    # I'm not sure if that's actually needed. 

    return jsonify({"data": firebase_members}), 200
    

@app.route('/get/users/playlists') #Getting spotify playlists, as opposed to get library 
@FirebaseManager.require_firebase_auth
def get_users_playlists():
    user_id = request.user_id

    try:
        spotify = SpotifyManager()
        firebase = FirebaseManager()

        # get the user's firebase object so we can get the spotify access token
        user = firebase.get_user_info(user_id)
        
        # Check if user has Spotify access token
        if not user.access_token:
            return jsonify({"error": "User has not connected Spotify account. Please complete the Spotify onboarding flow."}), 400

        # Check if user has refresh token
        if not user.refresh_token:
            return jsonify({"error": "Spotify refresh token is missing. Please reconnect your Spotify account through the onboarding flow."}), 400

        # refresh the access_token if needed
        try:
            spotify.refresh_access_token_and_update_firebase_if_needed(user_id)
        except ValueError as ve:
            # This is a user-facing error about missing/invalid tokens
            return jsonify({"error": str(ve)}), 400
        except Exception as token_error:
            # Other token refresh errors
            return jsonify({"error": f"Failed to refresh Spotify token: {str(token_error)}. Please reconnect your Spotify account."}), 400
        
        # Get fresh user data after potential token refresh
        user = firebase.get_user_info(user_id)

        playlists = spotify.get_users_playlists(user.access_token)
        return jsonify({"data": playlists}), 200
    except Exception as e:
        print(f"Error fetching Spotify playlists: {e}")
        return jsonify({"error": f"Failed to fetch playlists: {str(e)}"}), 500

# gets a users playlists from firestore
@app.route('/get/users/playlists/firebase')
@FirebaseManager.require_firebase_auth
def get_users_playlists_firebase():
    user_id = request.user_id
    firebase = FirebaseManager()

    user = firebase.get_user_info(user_id)
    # for playlist_id

    return jsonify({"data": user.library}), 200

@app.route('/get/playlist/group')
@FirebaseManager.require_firebase_auth
def get_group_playlists():
    error = validate_params(['group_id'])
    if error:
        return error
    
    user_id = request.user_id

    group_id: str = request.args.get("group_id")

    firebase = FirebaseManager()

    group = firebase.get_group_info(group_id)

    # Get ALL playlists in the group (not just remaining ones)
    all_playlist_ids: list[str] = []
    for member_id, member_data in group.group_member_data.items():
        member_playlist_ids = [posted_playlist.playlist_id for posted_playlist in member_data.posted_playlists]
        all_playlist_ids.extend(member_playlist_ids)

    # Fetch playlist details
    playlists = []
    for playlist_id in all_playlist_ids:
        try:
            playlist = firebase.get_playlist_info(playlist_id)
            playlist_dict = playlist.to_dict_with_id(playlist_id)
            
            # Add metadata about whether this playlist can be taken by the current user
            # NOTE: For demo purposes, allowing users to take their own playlists
            playlist_dict['can_take'] = (
                playlist_id not in group.group_member_data[user_id].taken_playlists
            )
            playlist_dict['is_owner'] = playlist.owner_id == user_id
            playlist_dict['is_taken'] = playlist_id in group.group_member_data[user_id].taken_playlists
            
            playlists.append(playlist_dict)
        except ValueError:
            # Playlist doesn't exist, skip it
            continue

    return jsonify({"data": playlists}), 200

@app.route('/add/playlist/group')
@FirebaseManager.require_firebase_auth
def add_playlist_to_group():
    error = validate_params(['group_id', 'spotify_playlist_id'])
    if error:
        return error
    
    user_id = request.user_id

    group_id: str = request.args.get("group_id")
    spotify_playlist_id: str = request.args.get("spotify_playlist_id")

    # get user and group from firebase
    firebase = FirebaseManager()
    spotify = SpotifyManager()

    # refresh the access_token if needed
    spotify.refresh_access_token_and_update_firebase_if_needed(user_id)

    user = firebase.get_user_info(user_id)
    group = firebase.get_group_info(group_id)


    # check if user has already posted their max number of playlists
    MAX_PLAYLIST_POSTINGS: int = 7

    if len(group.group_member_data[user_id].posted_playlists) >= MAX_PLAYLIST_POSTINGS:
        return jsonify({"error": f"User has already posted the max number of {MAX_PLAYLIST_POSTINGS} playlists"}), 400

    # check if last post was at least 24 hours ago
    now = datetime.now(timezone.utc)

    if now - group.group_member_data[user_id].last_posting_timestamp <= timedelta(hours=24):
        return jsonify({"error": "User has already posted within the last 24 hours"}), 400

    # get spotify playlist info
    raw_playlist = spotify.get_playlist_info(user.access_token, spotify_playlist_id)

    # add playlist info to firebase
    playlist = Playlist(
        spotify_id=spotify_playlist_id,
        owner_id=user_id,
        title=raw_playlist["name"],
        cover=raw_playlist["images"][0]["url"],
        description=raw_playlist["description"],
        songs=[]
    )

    # add all the songs into the playlist
    for added_info in raw_playlist["tracks"]["items"]:
        spotify_song = added_info["track"]
        print(spotify_song)
        # check if this song has already been added to the firebase
        spotify_song_id = spotify_song["id"]
        try:
            firebase.get_song_info(spotify_song_id)
        except ValueError:
            song = Song(
                spotify_id=spotify_song_id,
                album_cover=spotify_song["album"]["images"][0]["url"],
                album_name=spotify_song["album"]["name"],
                artist_name=", ".join([artist_data["name"] for artist_data in spotify_song["artists"]]),
                title=spotify_song["name"]
            )

            firebase.create_song(spotify_song_id, song)

        playlist.songs.append(spotify_song_id)


    # Create playlist in firebase using helper function
    playlist_id = firebase.create_playlist(playlist)
    
    # Add playlist to user's library
    if playlist_id not in user.library:
        user.library.append(playlist_id)
        firebase.update_user(user_id, user)
    
    # Update group with playlist info using helper function
    group.group_member_data[user_id].posted_playlists.append(PostedPlaylist(
        playlist_id=playlist_id,
        number_downloaded=0
    ))

    group.group_member_data[user_id].coins += 1

    group.group_member_data[user_id].last_posting_timestamp = now

    # Update group using helper function
    firebase.update_group(group_id, group)

    return jsonify({"message": "Success!"}), 200

@app.route('/take/playlist/group')
@FirebaseManager.require_firebase_auth
def take_playlist_from_group():
    firebase = FirebaseManager()
    error = validate_params(["group_id", "playlist_id"])
    if error:
        return error

    user_id: str = request.user_id
    group_id: str = request.args.get("group_id")
    playlist_id: str = request.args.get("playlist_id")

    firebase_user = firebase.get_user_info(user_id)
    firebase_group = firebase.get_group_info(group_id)
    firebase_playlist = firebase.get_playlist_info(playlist_id)

    #Make sure person is in the group
    if user_id not in firebase_group.member_ids:
        return jsonify({"error": "User is not a member of this group"}), 400
    if group_id not in firebase_user.my_groups:
        return jsonify({"error": "Data is not consistent, group claims user, but user does not claim group"}), 400

    # Make sure that the user is not the owner of the playlist
    if user_id == firebase_playlist.owner_id:
        return jsonify({"error":"User cannot swap for a playlist they created"}), 400
    
    #TODO: Possibly change this implementation to be "take down a playlist without spending a coin,"
    # if we want the functionality to take down playlists.

    #Make sure that the person has not taken the playlist before
    if playlist_id in firebase_group.group_member_data[user_id].taken_playlists:
        return jsonify({"error": "User has already taken this playlist."}), 400
    
    # Check if playlist is already in user's library (data consistency check)
    if playlist_id in firebase_user.library:
        return jsonify({"error": "Playlist is already in your library."}), 400
    
    #Make sure that they have the coins to do it.
    if firebase_group.group_member_data[user_id].coins <= 0:
        return jsonify({"error": "User does not have enough coins to take this playlist"}), 400
    
    # Add the playlist to the user's library
    firebase_user.library.append(playlist_id)
    firebase.update_user(user_id, firebase_user)
    
    # Mark the playlist as taken in the group
    firebase_group.group_member_data[user_id].taken_playlists.append(playlist_id)
    
    # Increment the number of times that playlist has been downloaded for the owner
    for member_id, member_data in firebase_group.group_member_data.items():
        for posted_playlist in member_data.posted_playlists:
            if posted_playlist.playlist_id == playlist_id:
                posted_playlist.number_downloaded += 1
            
                #If the playlist has been downloaded by all users aside from the poster, remove it from the group. 
                if posted_playlist.number_downloaded == len(firebase_group.member_ids) - 1:
                    #remove the playlist from the 'posted_playlists' group
                    member_data.posted_playlists.remove(posted_playlist)
                    #TODO: OPTIONAL: Remove from every other user's taken_playlists array                        

    #'Charge' the user a coin for taking the playlist. 
    firebase_group.group_member_data[user_id].coins -= 1
    
    # Update the group in Firebase using helper function
    firebase.update_group(group_id, firebase_group)

    return jsonify({"message": "Success!"}), 200


@app.route('/get/playlist/library')
@FirebaseManager.require_firebase_auth
def get_library_playlists():
    user_id = request.user_id

    firebase = FirebaseManager()

    user = firebase.get_user_info(user_id)

    # Fetch playlists, skipping any that don't exist (e.g., deleted playlists)
    playlists = []
    for playlist_id in user.library:
        try:
            playlist = firebase.get_playlist_info(playlist_id)
            playlist_dict = playlist.to_dict_with_id(playlist_id)
            playlists.append(playlist_dict)
        except ValueError:
            # Playlist doesn't exist, skip it
            print(f"Warning: Playlist {playlist_id} not found in Firestore, skipping")
            continue

    return jsonify({"data": playlists}), 200

@app.route('/get/playlist/items')
@FirebaseManager.require_firebase_auth
def get_playlist_items():
    error = validate_params(["playlistID"])
    if error:
        return error

    playlist_id: str = request.args.get("playlistID")

    firebase = FirebaseManager()
    playlist = firebase.get_playlist_info(playlist_id)

    songs = [ firebase.get_song_info(id).to_dict() for id in playlist.songs ]

    return jsonify({"data": songs}), 200

@app.route('/export/playlist')
@FirebaseManager.require_firebase_auth
def exportPlaylist():
    error = validate_params(["playlistID"])
    if error:
        return error
    playlist_id: str = request.args.get("playlistID")

    user_id = request.user_id


    firebase = FirebaseManager()
    spotify = SpotifyManager()

    spotify.refresh_access_token_and_update_firebase_if_needed(user_id)

    user = firebase.get_user_info(user_id)

    # check if user has already exported this playlist
    if playlist_id in user.exported_playlists:
        return jsonify({"message": "playlist previously exported!"}), 400

    #if not add to exported playlists
    user.exported_playlists.append(playlist_id)
    firebase.update_user(user_id, user)

    access_token = user.access_token

    # get spotify access token
    # spotifyAuth = get_auth_url()

    # get playlist info
    playlist = firebase.get_playlist_info(playlist_id)

    spotify.export_playlist(access_token, playlist.title, playlist.description, playlist.songs)
    return jsonify({"message": "Success!"}), 200


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
