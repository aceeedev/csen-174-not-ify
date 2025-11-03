# imports
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from typing import Optional

from models.group import Group
from models.playlist import Playlist
from models.song import Song
from models.user import User

    # Helpers
class FirebaseManager:
    _instance: Optional["FirebaseManager"] = None

    # live laugh love singletons
    def __new__(cls):
        """Ensure only one instance exists."""
        if cls._instance is None:
            cls._instance = super(FirebaseManager, cls).__new__(cls)
            cls._instance._init_firebase()
        
        return cls._instance

    def _init_firebase(self):
        try:
            self.app = firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate("serviceAccount.json")
            self.app = firebase_admin.initialize_app(cred)
        
        self.db = firestore.client(app=self.app)

    
    def streamToDict(self, docs):
        user_list = []
        for doc in docs:
            data = doc.to_dict()
            if data is None:
                continue
            data['id'] = doc.id
            user_list.append(data)

        return user_list

    def getDocInfo(self, collection, docID):
        doc_ref = self.db.collection(collection).document(docID)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {"error:": f"Not Found"}

    def getCollection(self, collectionName: str):
        docs_ref = self.db.collection(collectionName)
        docs = docs_ref.stream()

        return self.streamToDict(docs)

    def createDoc(self, collectionName: str, data: dict): #how to get random slug as ID
        # creates a new doc in a collection, the calling function must ensure data is valid for the collection
        self.db.collection(collectionName).document().set(data)

        return True

    def deleteDoc(self, collectionName: str, docID: str):
        self.db.collection(collectionName).document(docID).delete()
        
        return True

    def updateDoc(self, collectionName: str, docID, data: dict):
        self.db.collection(collectionName).document(docID).update(data)
        
        return True
    
    # GROUPS:

    def createGroup(self, groupName: str, ownerID: str, maxMembers: int, description: str, maxPLists: int):
        #check values 
        if maxMembers < 1 or maxMembers > 20:
            raise ValueError("Max members must be between 1 and 20")
        if maxPLists < 1 or maxPLists > 20:
            raise ValueError("Max playlists must be between 1 and 20")
        if len(groupName) < 1 or len(groupName) > 50:
            raise ValueError("Group name must be between 1 and 50 characters")
        if len(description) > 100:
            raise ValueError("Description must be less than 100 characters") 
        # Check if owner exists
        owner_data = self.getDocInfo('Users', ownerID)
        if 'error' in owner_data:
            raise ValueError("Owner ID must be a valid user ID")
        
        # Check if group name is unique
        all_groups = self.getGroups()
        for group in all_groups:
            if group.get('groupName') == groupName:
                raise ValueError("Group name must be unique")
    
        #create group

        data = {
            'groupName': groupName,
            'ownerID': ownerID,
            'maxMembers': maxMembers,
            'description': description,
            'maxPLists': maxPLists
        }
        self.createDoc('Groups', data)
        
    def deleteGroup(self, groupID: str):
        self.deleteDoc('Groups', groupID)
        return True 
    
    def getGroups(self):
        return self.getCollection('Groups')

    def addMember(self, groupID: str, memberID: str):
        group_data = self.getDocInfo('Groups', groupID)
        if 'error' in group_data:
            raise ValueError("Group ID must be a valid group ID")
        
        # Check if member exists
        member_data = group_data.get('memberIDs', [])  # Initialize to empty list if doesn't exist
        if memberID in member_data:
            raise ValueError("Member already in group")
        if len(member_data) >= group_data.get('maxMembers', 20):
            raise ValueError("Group is already at maximum capacity, cannot add more members.")
        member_data.append(memberID)
        self.updateDoc('Groups', groupID, {'memberIDs': member_data})
        
        return True
    
    def removeMember(self, groupID: str, memberID: str):
        group_data = self.getDocInfo('Groups', groupID)
        if 'error' in group_data:
            raise ValueError("Group ID must be a valid group ID")
        
        if 'memberIDs' not in group_data:
            raise ValueError("Group has no members")
        
        if memberID not in group_data['memberIDs']:
            raise ValueError("Member ID not in group")
        
        group_data['memberIDs'].remove(memberID)
        self.updateDoc('Groups', groupID, {'memberIDs': group_data['memberIDs']})
        return True



        
    # getMemberIDs

    # addPlaylistToBoard
    # removePlaylistFromBoard
    # getPlaylistBoardIDs

    # changeOwner
    # getOwnerUID

    # changeDescription
    # getDescription

        # Playlists

    # addPlaylist
    # removePlaylist
    def deletePlaylist(self, playlistID):
        # does this need to also remove it from any group boards it's on

        pass

    # getPlaylistInfo
    def getPlaylistInfo(self, playlistID: str):
        return self.getDocInfo('Playlists', playlistID)
    # getPlaylistSongs
    def getPlaylistSongs(self, playlistID: str): #might be unnecessary
        playlist = self.getPlaylistInfo(playlistID)
        songs = playlist["songs"]
        return songs
    # getOwnerUID
    def getPlaylistOwnerUID(self, playlistID: str): #might be unnecessary
        playlist = self.getPlaylistInfo(playlistID)
        ownerUID = playlist["ownerUserID"]
        return ownerUID

        # Songs

    # addSong
    # removeSong
    # getSongInfo
    def getSongInfo(self, songID: str):
        return self.getDocInfo('Songs', songID)
    # getSongs
    def getSongs(self):
        return self.getCollection('Songs')

        # Users

    # createUser
    def createUser(self, accessToken, name, groups=[], isAdmin=False, spotifyUID=None):

        userData = {
            "accessToken" : accessToken,
            "groups" : groups,
            "isAdmin" : isAdmin,
            "name" : name,
            "spotifyUID" : spotifyUID

        }
        self.createDoc("Users", userData)
    # deleteUser
    def deleteUser(self, userID):
        self.deleteDoc("Users", userID)

    # getUserInfo
    def getUserInfo(self, userID: str):
        return self.getDocInfo('Users', userID)
    # getUserList
    def getUserList(self):
        return self.getCollection('Users')

    # addGroup
    # removeGroup
    # isAdmin
    # setAdminStatus
    # getSpotifyUID
    def getSpotifyUID(self, UID):
        user = self.getUserInfo(UID)
        return user["spotifyUID"]
    # setSpotifyUID
    def setSpotifyUID(self, UID):
        return
