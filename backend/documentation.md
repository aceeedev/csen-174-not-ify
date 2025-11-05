# Documentation
## main.py

### `def validate_params(required_params: list[str])`
**Input:** The parameters that are required for a function

Checks `request.args.get(p)` against `required_params`, checks that all necessary parameters are provided, returns `error: missing required parameters` on failure. 

**Output** `None` on success, `error` on failure. 

---

### `@app.route('/get/groups')`
`http:<...>:5000/create/group?groupName=<str>&description=<str>`

**Parameters:** groupName, description.

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/join/group')`
`http:<...>:5000/join/group?groupID=<str>`

**Parameters:** groupID.

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/edit/group')`
`http:<...>:5000/edit/group?groupID=<str>&action=<str>&params=<str>`

**Parameters:** groupID, action, params <- only if action == remove_user

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/users/playlists')`
`http:<...>:5000/get/users/playlists`

**Parameters:** N/A

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/playlist/group')`
`http:<...>:5000/get/playlist/group?groupID=<str>`

**Parameters:** groupID

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/add/playlist/group')`
`http:<...>:5000/add/playlist/group?group_id=<str>&spotify_playlist_id=<str>`

**Parameters:** group_id, spotify_playlist_id 

**Requires:** userID (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/take/playlist/group')`
`http:<...>:5000/take/playlist/group?groupID=<str>&playlistID=<str>`

**Parameters:** groupID, playlistID

**Requires:** userID (from @FirebaseManager.require_firebase_auth)