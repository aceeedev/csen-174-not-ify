from typing import Any
from datetime import datetime, timezone


#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025 
#   General: Changed plistBoard to shelf
#UC2: Katie 10/31/2025


class PostedPlaylist:
    def __init__(self, playlist_id: str, number_downloaded: int) -> None:
        self.playlist_id = playlist_id
        self.number_downloaded = number_downloaded

    def to_dict(self) -> dict[str, Any]:
        return {
            "playlist_id": self.playlist_id,
            "number_downloaded": self.number_downloaded,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            playlist_id=data["playlist_id"],
            number_downloaded=data["number_downloaded"],
        )
    

class GroupMemberData:
    def __init__(self, coins: int, last_posting_timestamp: datetime, taken_playlists: list[str], posted_playlists: list[PostedPlaylist]) -> None:
        self.coins = coins
        self.last_posting_timestamp = last_posting_timestamp
        self.taken_playlists = taken_playlists
        self.posted_playlists = posted_playlists
        
    def to_dict(self) -> dict[str, Any]:
        return {
            "coins": self.coins,
            "last_posting_timestamp": self.last_posting_timestamp.astimezone(timezone.utc),
            "taken_playlists": self.taken_playlists,
            "posted_playlists": [
                playlist.to_dict() for playlist in self.posted_playlists
            ],
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            coins=data["coins"],
            last_posting_timestamp=datetime.fromisoformat(data["last_posting_timestamp"]),
            taken_playlists=data["taken_playlists"],
            posted_playlists=[
                PostedPlaylist.from_dict(p) for p in data["posted_playlists"]
            ]
        )

class Group:
    def __init__(self, owner_id: str, member_ids: list[str], shelf: list[str], description: str, group_name: str, group_member_data: dict[str, GroupMemberData]):
        self.owner_id = owner_id
        self.member_ids = member_ids
        self.shelf = shelf
        self.description = description
        self.group_name = group_name
        self.group_member_data = group_member_data

        # Constants
        self.maxPLists = 20
        self.maxMembers = 20

    def to_dict(self) -> dict[str, Any]:
        return {
            "owner_id": self.owner_id, 
            "member_ids": self.member_ids,
            "shelf": self.shelf,
            "description": self.description,
            "group_name": self.group_name,
            "group_member_data": {
                member_id: data.to_dict()
                for member_id, data in self.group_member_data.items()
            }
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            owner_id=data['owner_id'],
            member_ids=data['member_ids'],
            shelf=data['shelf'],
            description=data['description'],
            group_name=data['group_name'],
            group_member_data={
                member_id: GroupMemberData.from_dict(data)
                for member_id, data in data['group_member_data'].items()
            }
        )
