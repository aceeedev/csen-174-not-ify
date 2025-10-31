from flask import Flask, jsonify, request
from flask_cors import CORS

import FireStoreInterface as FSI
from spotifyInterface import SpotifyManager


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
