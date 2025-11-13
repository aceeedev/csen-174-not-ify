from typing import Any
from datetime import datetime, timezone

from utils import ensure_datetime


#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025 v
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
            last_posting_timestamp=ensure_datetime(data["last_posting_timestamp"]),
            taken_playlists=data["taken_playlists"],
            posted_playlists=[
                PostedPlaylist.from_dict(p) for p in data["posted_playlists"]
            ]
        )
    
    @classmethod
    def default(cls):
        return cls(
            coins=0, 
            last_posting_timestamp=datetime(2023, 11, 3), 
            taken_playlists=[],
            posted_playlists=[]
        )


class Group:
    def __init__(self, owner_id: str, member_ids: list[str], description: str, group_name: str, group_member_data: dict[str, GroupMemberData]) -> None:
        """
        Represents a group document stored in Firestore.

        Args:
            owner_id (str): The UID of the group's owner.
            member_ids (list[str]): List of Firebase user IDs of members.
            shelf (list[str]): Playlist IDs currently displayed on the group's shelf.
            description (str): Text description of the group.
            group_name (str): The display name of the group.
            group_member_data (dict[str, GroupMemberData]): 
                A mapping from Firebase user IDs to their associated `GroupMemberData` objects.
                Example:
                    {
                        "uid_123": GroupMemberData(...),
                        "uid_456": GroupMemberData(...)
                    }
        """

        self.owner_id = owner_id
        self.member_ids = member_ids
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
            "description": self.description,
            "group_name": self.group_name,
            "group_member_data": {
                member_id: member_data.to_dict()
                for member_id, member_data in self.group_member_data.items()
            }
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            owner_id=data['owner_id'],
            member_ids=data['member_ids'],
            description=data['description'],
            group_name=data['group_name'],
            group_member_data={
                member_id: GroupMemberData.from_dict(member_data)
                for member_id, member_data in data['group_member_data'].items()
            }
        )
    
    def get_remaining_playlists_on_shelf(self, user_id: str):
        """
        Returns a list of playlist ids that are not the user's and that are left for the user to unlock

        Replaces need for shelf, since posted playlists are already stored in the group member data
        """

        playlist_ids: list[str] = []

        # get all posted playlists that are not this user's
        for member_id, member_data in self.group_member_data.items():
            if member_id != user_id:
                member_playlist_ids = [posted_playlist.playlist_id for posted_playlist in member_data.posted_playlists]

                playlist_ids.extend(member_playlist_ids)

        # remove playlist ids already taken
        playlist_ids = [id for id in playlist_ids if id not in self.group_member_data[user_id].taken_playlists]

        return playlist_ids
