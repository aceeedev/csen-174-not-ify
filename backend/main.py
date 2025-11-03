from flask import Flask, jsonify, request
from flask_cors import CORS

import FireStoreInterface as FSI
from spotifyInterface import SpotifyManager

from models import group
from models import playlist
from models import song
from models import user


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/data')
def get_data():
    data = {
        "name": "Alice",
        "age": 30,
        "city": "New York"
    }
    return jsonify(data)

@app.route('/api/data/auth-url')
def get_auth_url():    
    spotify = SpotifyManager()

    auth_url: str = spotify.get_auth_url()

    return jsonify({'auth_url': auth_url}) 

@app.route('/api/data/auth-callback')
def auth_callback():
    code: str = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing code parameter"}), 400
    
    spotify = SpotifyManager()

    access_token: str = spotify.get_access_token(code)
    print(access_token)

    return jsonify({'access_token': access_token}) 


@app.route('/api/data/users')
def get_users():
    return jsonify(FSI.getUserList())

@app.route('/api/data/songs/<songID>')
def get_song(songID):
    return jsonify(FSI.getSongInfo(songID))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

### Class Functions ###

##Transfered From Group.py##
def inviteMember(self: group, callerID: str, inviteeID: str):
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

def add_to_shelf(self: group, playlist): #UC1
    if playlist not in self.shelf:
        self.shelf.append(playlist)


def take_down_plist(self: group, playlist): #UC1
    if playlist not in self.shelf:
        raise Exception("Cannot remove playlist that is not on the shelf.")
        errorCaught = True
    else:
        self.shelf.remove(playlist)

##Transferred from Playlist.py##
def add_to_library(self: playlist, user): #UC1
    if self not in user.library:
        user.save_playlist(self)
    else:
        raise Exception("User {user} already has a copy of {self.title}")
        errorCaught = True


def export_to_spotify(self: playlist, spotify_client):
    """Export the playlist to Spotify using the provided Spotify client."""
    pass

def get_playlist(self: playlist):
    return self

def add_song(self: playlist, song: Song):
    if song not in self.songs:
        self.songs.append(song)

def remove_song(self: playlist, song: Song):
    self.songs = [obj for obj in self.songs if obj != song]


def change_cover(self: playlist, new_cover: str):
    self.cover = new_cover

def change_title(self: playlist, new_title: str):
    self.title = new_title

## From user.py ##

def spotify_login(self: user, spotify_user):
    pass

def respond_to_complaint(self: user, complaint_id: str, response: str, action: str) -> bool:
    return self.isAdmin

'''
def create_complaint(self, complaint: AdminComplaint):
    self.myComplaints.append(complaint)
'''

def remove_complaint(self: user, id: str):
    # create a new array with all complaints except the one with the given id
    self.myComplaints = [obj for obj in self.myComplaints if obj.id != id]

def save_playlist(self: user, playlist):
    self.library.append(playlist) #UC1. User has playlist relationship checked in playlist
