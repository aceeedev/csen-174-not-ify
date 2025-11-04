from typing import Any, Type, TypeVar

from datetime import datetime

GroupMemberDataType = TypeVar("GroupMemberDataType", bound="GroupMemberData")

class GroupMemberData:
    def __init__(self, coins: int, last_posting_timestamp: datetime, taken_playlists: list[str]) -> None:
        self.coins = coins
        self.last_posting_timestamp = last_posting_timestamp
        self.taken_playlists = taken_playlists

    def to_dict(self) -> dict[str, Any]:
        return {
            "coins": self.coins,
            "last_posting_timestamp": self.last_posting_timestamp,
            "taken_playlists": self.taken_playlists,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            coins=data["coins"]
        )
    