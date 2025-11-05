from dotenv import load_dotenv
import os
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from typing import Optional, Any

load_dotenv()


class SpotifyManager:
    _instance: Optional["SpotifyManager"] = None

    # live laugh love singletons
    def __new__(cls):
        """Ensure only one instance exists."""
        if cls._instance is None:
            cls._instance = super(SpotifyManager, cls).__new__(cls)
            cls._instance._init_spotify()
        
        return cls._instance

    def _init_spotify(self):
        self.auth_manager = SpotifyOAuth(
            client_id=os.getenv("SPOTIFY_CLIENT_ID"),
            client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
            redirect_uri="http://localhost:5173/callback",
            scope="user-library-read"
        )


    def get_auth_url(self) -> str:
        return self.auth_manager.get_authorize_url()
    
    def get_access_token(self, code: str) -> dict[str, Any]:
        return self.auth_manager.get_access_token(code, check_cache=False)


    def get_users_playlists(self, access_token: str):
        """Fetch current user's playlists."""

        sp = spotipy.Spotify(auth=access_token)
        
        results = sp.current_user_playlists()
        
        return [
            {
                "spotify_id": playlist["id"],
                "title": playlist["name"],
                "cover": playlist["images"][-1]["url"] 
            } 
            for playlist in results["items"] 
        ]
    
    def get_playlist_info(self, access_token: str, playlist_id: str):
        """
        I think this endpoint? https://developer.spotify.com/documentation/web-api/reference/get-playlist
        """

        sp = spotipy.Spotify(auth=access_token)
        
        return sp.playlist(playlist_id)
