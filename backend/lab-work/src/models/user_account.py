import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.types.user_types import AdminComplaint

class UserAccount:
    def __init__(self, name: str, spotify_id: str, profile_pic: str, my_groups: list = None, is_admin: bool = False, my_complaints: list = None):
        self.name = name
        self.spotify_id = spotify_id
        self.profile_pic = profile_pic
        self.myGroups = my_groups or []
        self.isAdmin = is_admin
        self.myComplaints = my_complaints or []

    def __eq__(self, other) -> bool:
        return self.name == other.name and self.spotify_id == other.spotify_id and self.profile_pic == other.profile_pic and self.myGroups == other.myGroups and self.isAdmin == other.isAdmin and self.myComplaints == other.myComplaints

    def spotify_login(self, spotify_user):
        pass

    def respond_to_complaint(self, complaint_id: str, response: str, action: str) -> bool:
        return self.isAdmin

    def create_complaint(self, complaint: AdminComplaint):
        self.myComplaints.append(complaint)

    def remove_complaint(self, id: str):
        # create a new array with all complaints except the one with the given id
        self.myComplaints = [obj for obj in self.myComplaints if obj.id != id]
