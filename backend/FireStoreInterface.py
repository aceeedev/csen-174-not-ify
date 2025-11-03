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

    #Groups

# makeGroup
# deleteGroup
# getGroups

# addMember
# removeMember
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
# getPlaylistSongs
# getOwnerUID

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

# createUser - get passed a UID
# deleteUser
# getUserInfo
def getUserInfo(userID: str):
    return getUserInfo('Users', userID)
# getUserList
def getUserList():
    return getCollection('Users')

# addGroup
# removeGroup
# isAdmin
# setAdminStatus
# getSpotifyUID
# setSpotifyUID