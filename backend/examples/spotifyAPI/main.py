import spotipy
from spotipy.oauth2 import SpotifyOAuth

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="f9f02b1bcab54d30b4804212e4608286",
                                               client_secret="",
                                               redirect_uri="http://127.0.0.1:3000",
                                               scope="user-library-read"))

results = sp.current_user_playlists()
for idx, item in enumerate(results['items']):
    print(f"{idx}, {item['name']}")


print(results['items'][0])
playlistID = results['items'][0]['id']

playlist = sp.playlist()