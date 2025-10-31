import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from typing import Any


# from src.types.user_types import AdminComplaint

class UserAccount:
    def __init__(self, name: str, spotify_id: str, accessToken: str, profile_pic: str, library: list = None, my_groups: list = None, is_admin: bool = False, my_complaints: list = None):
        self.name = name
        self.spotify_id = spotify_id
        self.accessToken = accessToken #UC2
        self.profile_pic = profile_pic
        self.library = library #UC1
        self.myGroups = my_groups or []
        self.isAdmin = is_admin
        self.myComplaints = my_complaints or []

    def to_dict(self) -> dict[str, Any]: #UC2
        return {
            #firebase = object variable
            "accessToken": self.accessToken, 
            "groups": self.myGroups,
            "isAdmin": self.isAdmin,
            "name": self.name,
            "spotifyUID": self.spotify_id
        }

    @classmethod
    def from_dict(cls, data): #UC2
        return cls(
            #object var = from firebase
            accessToken=data['accessToken'],
            myGroups=data['groups'],
            isAdmin=data['isAdmin'],
            name=data['name'],
            spotify_id=data['spotifyUID']  
        )


    def spotify_login(self, spotify_user):
        pass

    def respond_to_complaint(self, complaint_id: str, response: str, action: str) -> bool:
        return self.isAdmin

    '''
    def create_complaint(self, complaint: AdminComplaint):
        self.myComplaints.append(complaint)
    '''

    def remove_complaint(self, id: str):
        # create a new array with all complaints except the one with the given id
        self.myComplaints = [obj for obj in self.myComplaints if obj.id != id]

    def save_playlist(self, playlist):
        self.library.append(playlist) #UC1. User has playlist relationship checked in playlist
    