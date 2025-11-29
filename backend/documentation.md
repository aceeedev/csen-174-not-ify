# Documentation
## main.py

### `def validate_params(required_params: list[str])`
**Input:** The parameters that are required for a function

Checks `request.args.get(p)` against `required_params`, checks that all necessary parameters are provided, returns `error: missing required parameters` on failure. 

**Output** `None` on success, `error` on failure. 

---

### `@app.route('/get/groups')`
`http:<...>:5000/get/groups?groupName=<str>`

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/create.group')`
`http:<...>:5000/create/group?group_name=<str>&description=<str>`

**Parameters:** group_name, description

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/join/group')`
`http:<...>:5000/join/group?group_id=<str>`

**Parameters:** group_id.

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/invite/group')`
`http:<...>:5000/invite/group?group_id=<str>&invitee_user_id=<str>`

**Parameters:** group_id, invitee_user_id.

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/edit/group')`
`http:<...>:5000/edit/group?group_id=<str>&action=<str>&params=<str>`

**Parameters:** group_id, action, params <- only if action == remove_user

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/users/playlists')`
`http:<...>:5000/get/users/playlists`

**Parameters:** N/A

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/users/playlists/firebase')`

?

---

### `@app.route('/get/playlist/group')`
`http:<...>:5000/get/playlist/group?group_id=<str>`

**Parameters:** group_id

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/add/playlist/group')`
`http:<...>:5000/add/playlist/group?group_id=<str>&spotify_playlist_id=<str>`

**Parameters:** group_id, spotify_playlist_id 

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/take/playlist/group')`
`http:<...>:5000/take/playlist/group?group_id=<str>&playlist_id=<str>`

**Parameters:** group_id, playlist_id

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/playlist/library')`
`http:<...>:5000/get/playlist/library`

**Parameters** N/A

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---

### `@app.route('/get/playlist/items')`
`http:<...>:5000/get/playlist/items?playlist_id=<str>`

**Parameters** playlist_id

**Requires:** N/A (Though, @FirebaseManager.require_firebase_auth is included, though user_id is never implemented or used.)

---

### `@app.route('/export/playlist')`
`http:<...>:5000/export/playlist?playlist_id=<str>`

**Parameters** playlist_id

**Requires:** user_id (from @FirebaseManager.require_firebase_auth)

---