import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.types.user_types import AdminComplaint

class UserAccount:
    def __init__(self, name: str, spotify_id: str, profile_pic: str, my_groups: list = None, all_groups: list = None, all_users: list = None, is_admin: bool = False, my_complaints: list = None):
        self.name = name
        self.spotify_id = spotify_id
        self.profile_pic = profile_pic
        self.myGroups = my_groups or []
        self.allGroups = all_groups or []
        self.allUsers = all_users or []
        self.isAdmin = is_admin
        self.myComplaints = my_complaints or []

    def spotify_login(self, spotify_user):
        pass

    def remove_user(self, user_id: str):
        if self.isAdmin:
            #check if user exists in allUsers
            for user in self.allUsers:
                if user.id == user_id:
                    self.allUsers.remove(user)
                    print(f"User {user_id} removed from allUsers")
                    return True #user removed successfully
            print(f"User {user_id} does not exist in allUsers")
            return False #user does not exist in allUsers   
        return False #user is not admin or user does not exist in allUsers

    def respond_to_complaint(self, complaint_id: str, response: str, action: str):
        pass

    def remove_group(self, group_id: str)->bool:
        if self.isAdmin:
            #check if group exists in allGroups
            for group in self.allGroups:
                if group.id == group_id:
                    self.allGroups.remove(group)
                    print(f"Group {group_id} removed from allGroups")
                    return True #group removed successfully
            print(f"Group {group_id} does not exist in allGroups")
            return False
        return False #user is not admin or group does not exist in allGroups
    

    def create_complaint(self, complaint: AdminComplaint):
        self.myComplaints.append(complaint)

    def remove_complaint(self, id: str):
        # create a new array with all complaints except the one with the given id
        self.myComplaints = [obj for obj in self.myComplaints if obj.id != id]
