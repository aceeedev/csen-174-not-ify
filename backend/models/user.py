from typing import Any
from datetime import datetime, timezone

from utils import ensure_datetime


class User:
    def __init__(self, name: str, spotify_id: str, access_token: str, refresh_token: str, access_token_expires: datetime, profile_pic: str, library: list[str], my_groups: list[str], my_complaints: list[str], is_admin: bool = False) -> None:
        self.name = name
        self.spotify_id = spotify_id
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.access_token_expires = access_token_expires
        self.profile_pic = profile_pic
        self.library = library
        self.my_groups = my_groups
        self.my_complaints = my_complaints
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
            "is_admin": self.is_admin,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]): #UC2
        return cls(
            name=data['name'],
            spotify_id=data['spotify_id'],
            access_token=data['access_token'],
            refresh_token=data['refresh_token'],
            access_token_expires=ensure_datetime(data['access_token_expires']),
            profile_pic=data['profile_pic'],
            library=data['library'],
            my_groups=data['my_groups'],
            my_complaints=data['my_complaints'],
            is_admin=data['is_admin'],
        )
