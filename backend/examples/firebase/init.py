import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('serviceAccount.json')
print("got creds")
app = firebase_admin.initialize_app(cred)
print("initialized")
db = firestore.client()
print("db var init")
# Reference to the 'Users' collection
users_ref = db.collection('Users')
print("referenced Users")
# Stream all documents in the collection
docs = users_ref.stream()

for doc in docs:
    print(f"{doc.id} => {doc.to_dict()}")