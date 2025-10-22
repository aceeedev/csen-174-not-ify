import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('serviceAccount.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

# Reference to the 'cities' collection
users_ref = db.collection('Users')

# Stream all documents in the collection
docs = users_ref.stream()

for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")