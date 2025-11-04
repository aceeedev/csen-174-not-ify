from typing import Any

from models.group_member_data import GroupMemberData

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025 
#   General: Changed plistBoard to shelf
#UC2: Katie 10/31/2025


class Group:
    #TODO: Change shelf to be of datatype playlist
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
    