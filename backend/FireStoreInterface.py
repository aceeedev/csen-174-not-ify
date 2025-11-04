import firebase_admin
from firebase_admin import auth, credentials, firestore
from flask import request, jsonify
from functools import wraps
from typing import Optional, Any

from models.group import Group
from models.playlist import Playlist
from models.song import Song
from models.user import User


USER_COLLECTION = "Users"
GROUP_COLLECTION = "Groups"
SONG_COLLECTION = "Songs"
PLAYLIST_COLLECTION = "Playlists"


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

    
    def streamToDict(self, docs) -> list:
        user_list = []
        for doc in docs:
            data = doc.to_dict()
            if data is None:
                continue
            data['id'] = doc.id
            user_list.append(data)

        return user_list

    def getDocInfo(self, collectionName: str, docID: str):
        doc_ref = self.db.collection(collectionName).document(docID)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return {"error:": f"Not Found"}

    def getCollection(self, collectionName: str):
        docs_ref = self.db.collection(collectionName)
        docs = docs_ref.stream()

        return self.streamToDict(docs)

    def createDoc(self, collectionName: str, data: dict[str, Any]) -> str:
        """
        Creates a new document in the specified Firestore collection.

        Args:
            collectionName (str): The name of the Firestore collection where the document will be created.
            data (dict[str, Any]): The document data to write. Must match the schema expected by the collection.

        Returns:
            str: The auto-generated document ID of the newly created document.

        Example:
            >>> doc_id = firestoreClient.createDoc("users", {"name": "Andrew", "age": 22})
            >>> print(doc_id)
            '2JvP9mXb73UsaYf2S3hW'
        """

        doc_ref = self.db.collection(collectionName).document()
        doc_ref.set(data)

        return doc_ref.id

    def deleteDoc(self, collectionName: str, docID: str):
        self.db.collection(collectionName).document(docID).delete()
        
        return True

    def updateDoc(self, collectionName: str, docID: str, data: dict):
        self.db.collection(collectionName).document(docID).update(data)
        
        return True
    

    # Users:
    def create_user(self, user: User) -> str:
        return self.createDoc(USER_COLLECTION, user.to_dict())

    def delete_user(self, user_id: str):
        self.deleteDoc(USER_COLLECTION, user_id)
    
    def update_user(self, user_id: str, user: User):
        self.updateDoc(USER_COLLECTION, user_id, user.to_dict())

    def get_user_info(self, user_id: str) -> User:
        return User.from_dict(self.getDocInfo(USER_COLLECTION, user_id))
    
    # Groups:
    def create_group(self, group: Group) -> str:
        return self.createDoc(GROUP_COLLECTION, group.to_dict())

    def delete_group(self, group_id: str):
        self.deleteDoc(GROUP_COLLECTION, group_id)
    
    def update_group(self, group_id: str, group: Group):
        self.updateDoc(GROUP_COLLECTION, group_id, group.to_dict())

    def get_group_info(self, group_id: str) -> User:
        return Group.from_dict(self.getDocInfo(GROUP_COLLECTION, group_id))
    
    # Songs:
    def create_song(self, song: Song) -> str:
        return self.createDoc(SONG_COLLECTION, song.to_dict())

    def delete_song(self, song_id: str):
        self.deleteDoc(SONG_COLLECTION, song_id)
    
    def update_song(self, song_id: str, song: Song):
        self.updateDoc(SONG_COLLECTION, song_id, song.to_dict())

    def get_song_info(self, song_id: str) -> User:
        return Song.from_dict(self.getDocInfo(SONG_COLLECTION, song_id))

    # Playlists:
    def create_playlist(self, playlist: Playlist) -> str:
        return self.createDoc(PLAYLIST_COLLECTION, playlist.to_dict())

    def delete_playlist(self, playlist_id: str):
        self.deleteDoc(PLAYLIST_COLLECTION, playlist_id)
    
    def update_playlist(self, playlist_id: str, playlist: Playlist):
        self.updateDoc(PLAYLIST_COLLECTION, playlist_id, playlist.to_dict())

    def get_playlist_info(self, playlist_id: str) -> User:
        return Playlist.from_dict(self.getDocInfo(PLAYLIST_COLLECTION, playlist_id))

    # Authorization:
    def require_firebase_auth(f):
        """
        Flask decorator that verifies the Firebase user ID token from the request's Authorization header.
        If the token is invalid, missing, or expired, returns a 401 Unauthorized response.

        Expected header format:
            Authorization: Bearer <Firebase ID Token>

        Usage:
            @app.route("/protected")
            @require_firebase_auth
            def protected_route():
                user_id = request.user_id

                return jsonify({"message": f"You are authenticated as {user_id}!"})
        """
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get the Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"error": "Missing or invalid Authorization header"}), 401

            id_token = auth_header.split("Bearer ")[1]

            try:
                # Verify the Firebase token
                decoded_token = auth.verify_id_token(id_token)
                request.user_id = decoded_token['uid']  # Attach the user info to the request for later use
            except Exception as e:
                return jsonify({"error": "Invalid or expired token", "details": str(e)}), 401

            return f(*args, **kwargs)

        return decorated_function

