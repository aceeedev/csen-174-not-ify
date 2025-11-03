# imports
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

    # Helpers

# stream to dict
def streamToDict(docs):
    user_list = []
    for doc in docs:
        data = doc.to_dict()
        if data is None:
            continue
        data['id'] = doc.id
        user_list.append(data)

    return user_list

# getApp or auth
def getFirestoreDB():
    try:
        app = firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate("serviceAccount.json")
        app = firebase_admin.initialize_app(cred)
    return firestore.client(app=app)

def getDocInfo(collection, docID):
    db = getFirestoreDB()
    doc_ref = db.collection(collection).document(docID)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return {"error:": f"Not Found"}

def getCollection(collectionName: str):
    db = getFirestoreDB()
    docs_ref = db.collection(collectionName)
    docs = docs_ref.stream()
    return streamToDict(docs)

def createDoc(collection, data: dict): #how to get random slug as ID
    # creates a new doc in a collection, the calling function must ensure data is valid for the collection
    db = getFirestoreDB()
    db.collection(collection).document().set(data)

def deleteDoc(collection, docID):
    db = getFirestoreDB()
    db.collection(collection).document(docID).delete()
    return True

def updateDoc(collection, docID, data: dict):
    db = getFirestoreDB()
    db.collection(collection).document(docID).update(data)
    return True

# makeGroup
def makeGroup(groupName: str, ownerID: str, maxMembers: int, description: str, maxPLists: int):
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
    owner_data = getDocInfo('Users', ownerID)
    if 'error' in owner_data:
        raise ValueError("Owner ID must be a valid user ID")
    
    # Check if group name is unique
    all_groups = getGroups()
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
    createDoc('Groups', data)
    
# deleteGroup
def deleteGroup(groupID: str):
    deleteDoc('Groups', groupID)
    return True 
# getGroups
def getGroups():
    return getCollection('Groups')
# addMember
def addMember(groupID: str, memberID: str):
    group_data = getDocInfo('Groups', groupID)
    if 'error' in group_data:
        raise ValueError("Group ID must be a valid group ID")
    
    # Check if member exists
    member_data = group_data.get('memberIDs', [])  # Initialize to empty list if doesn't exist
    if memberID in member_data:
        raise ValueError("Member already in group")
    if len(member_data) >= group_data.get('maxMembers', 20):
        raise ValueError("Group is already at maximum capacity, cannot add more members.")
    member_data.append(memberID)
    updateDoc('Groups', groupID, {'memberIDs': member_data})
    return True
# removeMember
def removeMember(groupID: str, memberID: str):
    group_data = getDocInfo('Groups', groupID)
    if 'error' in group_data:
        raise ValueError("Group ID must be a valid group ID")
    
    if 'memberIDs' not in group_data:
        raise ValueError("Group has no members")
    
    if memberID not in group_data['memberIDs']:
        raise ValueError("Member ID not in group")
    
    group_data['memberIDs'].remove(memberID)
    updateDoc('Groups', groupID, {'memberIDs': group_data['memberIDs']})
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
def deletePlaylist(playlistID):
    # does this need to also remove it from any group boards it's on

    pass

# getPlaylistInfo
def getPlaylistInfo(playlistID: str):
    return getDocInfo('Playlists', playlistID)
# getPlaylistSongs
def getPlaylistSongs(playlistID: str): #might be unnecessary
    playlist = getPlaylistInfo(playlistID)
    songs = playlist["songs"]
    return songs
# getOwnerUID
def getPlaylistOwnerUID(playlistID: str): #might be unnecessary
    playlist = getPlaylistInfo(playlistID)
    ownerUID = playlist["ownerUserID"]
    return ownerUID

    # Songs

# addSong
# removeSong
# getSongInfo
def getSongInfo(songID: str):
    return getDocInfo('Songs', songID)
# getSongs
def getSongs():
    return getCollection('Songs')

    # Users

# createUser
def createUser(accessToken, name, groups=[], isAdmin=False, spotifyUID=None):

    userData = {
        "accessToken" : accessToken,
        "groups" : groups,
        "isAdmin" : isAdmin,
        "name" : name,
        "spotifyUID" : spotifyUID

    }
    createDoc("Users", userData)
# deleteUser
def deleteUser(userID):
    removeDoc("Users", userID)

# getUserInfo
def getUserInfo(userID: str):
    return getDocInfo('Users', userID)
# getUserList
def getUserList():
    return getCollection('Users')

# addGroup
# removeGroup
# isAdmin
# setAdminStatus
# getSpotifyUID
def getSpotifyUID(UID):
    user = getUserInfo(UID)
    return user["spotifyUID"]
# setSpotifyUID
def setSpotifyUID(UID):
    return