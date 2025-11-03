from typing import Any
import random
import string

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025 
#   General: Changed plistBoard to shelf
#UC2: Katie 10/31/2025


class Group:
    #TODO: Change shelf to be of datatype playlist
    def __init__(self, ownerID: str, memberIDs: list[str], shelf: list[str], desc: str, groupName: str):
        self.ownerID = ownerID
        self.memberIDs = memberIDs
        self.shelf = shelf
        self.description = desc
        self.groupName = groupName
        self.maxPLists = 20
        self.maxMembers = 20
        self.groupID = ''.join (random.choices(string.digits, k=10)) #Make a random 10 digit groupID

    def to_dict(self) -> dict[str, Any]: #UC2
        return {
            #firebase = object variable
            "description": self.description, 
            "maxMembers": self.maxMembers,
            "maxPlaylists": self.maxPLists,
            "memberIDs": self.memberIDs,
            "shelf": self.shelf
        }

    @classmethod
    def from_dict(cls, data): #UC2
        return cls(
            #object var = from firebase
            description=data['description'],
            maxMembers=data['maxMembers'],
            maxPlaylists=data['maxPlaylists'],
            memberIDs=data['memberIDs'],
            shelf=data['shelf']   
        )
    
    #Invite Member moved to Main.py

    #Add to Shelf Member moved to Main.py
    
    #Take Down Playlist moved to Main.py

    