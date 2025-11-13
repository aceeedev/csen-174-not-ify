from dotenv import load_dotenv
import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from typing import Optional, Any
from FireStoreInterface import FirebaseManager
from models.user import User

load_dotenv()

@dataclass
class SpotifyAccessTokenInfo:
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: str
    scope: str

    @classmethod
    def from_dict(cls, token_dict: dict[str, Any]):    
        return cls(
            access_token=token_dict["access_token"],
            token_type=token_dict.get("token_type", "Bearer"),
            expires_in=token_dict["expires_in"],
            refresh_token=token_dict["refresh_token"],
            scope=token_dict.get("scope", ""),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "access_token": self.access_token,
            "token_type": self.token_type,
            "expires_in": self.expires_in,
            "refresh_token": self.refresh_token,
            "scope": self.scope,
        }


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
            redirect_uri="http://127.0.0.1:5173/callback",
            scope="user-library-read"
        )


    # Authorization:
    def get_auth_url(self) -> str:
        return self.auth_manager.get_authorize_url()
    
    def get_access_token(self, code: str) -> SpotifyAccessTokenInfo:
        return SpotifyAccessTokenInfo.from_dict(self.auth_manager.get_access_token(code, check_cache=False))
    
    def __refresh_access_token(self, refresh_token: str) -> SpotifyAccessTokenInfo:
        return SpotifyAccessTokenInfo.from_dict(self.auth_manager.refresh_access_token(refresh_token))
    
    def refresh_access_token_and_update_firebase_if_needed(self, user_id: str) -> None:
        """
        Will get the new access_token and updates the user in the firebase for you if the access_token has expired.
        """
        
        # get the user object from firebase via the user id 
        firebase = FirebaseManager()
        user: User = firebase.get_user_info(user_id)

        if user.access_token_expires <= datetime.now(timezone.utc):
            new_access_token_info: SpotifyAccessTokenInfo = self.__refresh_access_token(user.refresh_token)

            # update user's values with the new access token info
            user.access_token = new_access_token_info.access_token
            user.refresh_token = new_access_token_info.refresh_token
            user.access_token_expires = datetime.now() + timedelta(seconds=new_access_token_info.expires_in - 60)

            # update the firebase's user 
            firebase.update_user(user_id, user)



    # Playlists:
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
        

    def export_playlist(self, access_token, playlist_name, description, track_ids):
        sp = spotipy.Spotify(auth=access_token)

        user_id = sp.me()["id"]
        try:
            playlist = sp.user_playlist_create(
                user=user_id,
                name=playlist_name,
                public=False,  # set True for public playlist
                description=description
            )
            if track_ids:
                sp.playlist_add_items(playlist["id"], track_ids)
        
        except spotipy.exceptions.SpotifyException as e:
            print(f"Spotify API error: {e}")
        except Exception as e:
            print(f"Unexpected error: {e}")

