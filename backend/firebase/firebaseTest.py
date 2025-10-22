import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

users_ref = db.collection("users")
docs = users_ref.stream()