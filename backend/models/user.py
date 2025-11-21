from typing import Any
from datetime import datetime, timezone

from utils import ensure_datetime


class User:
    def __init__(self, name: str, spotify_id: str, access_token: str, refresh_token: str, access_token_expires: datetime, profile_pic: str, library: list[str], my_groups: list[str], my_complaints: list[str], exported_playlists: list[str], is_admin: bool = False) -> None:
        self.name = name
        self.spotify_id = spotify_id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.access_token_expires = access_token_expires
        self.profile_pic = profile_pic
        self.library = library
        self.my_groups = my_groups
        self.my_complaints = my_complaints
        self.exported_playlists = exported_playlists
        self.is_admin = is_admin


    def to_dict(self) -> dict[str, Any]: #UC2
        return {
            "name": self.name,
            "spotify_id": self.spotify_id,
            "access_token": self.access_token,
            "refresh_token": self.refresh_token,
            "access_token_expires": self.access_token_expires.astimezone(timezone.utc),
            "profile_pic": self.profile_pic,
            "library": self.library,
            "my_groups": self.my_groups,
            "my_complaints": self.my_complaints,
            "exported_playlists": self.exported_playlists,
            "is_admin": self.is_admin,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]): #UC2
        # Handle missing fields for backward compatibility
        access_token_expires = data.get('access_token_expires')
        if access_token_expires:
            access_token_expires = ensure_datetime(access_token_expires)
        else:
            # Default to current time if missing
            access_token_expires = datetime.now(timezone.utc)
        
        return cls(
            name=data.get('name', ''),
            spotify_id=data.get('spotify_id', ''),
            access_token=data.get('access_token', ''),
            refresh_token=data.get('refresh_token', ''),
            access_token_expires=access_token_expires,
            profile_pic=data.get('profile_pic', ''),
            library=data.get('library', []),
            my_groups=data.get('my_groups', []),
            my_complaints=data.get('my_complaints', []),
            exported_playlists=data.get('exported_playlists', []),
            is_admin=data.get('is_admin', False),
        )
