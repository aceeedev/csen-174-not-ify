from flask import Flask, jsonify
import FireStoreInterface as FSI

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/data')
def get_data():
    data = {
        "name": "Alice",
        "age": 30,
        "city": "New York"
    }
    return jsonify(data)


@app.route('/api/data/users')
def get_users():
    return jsonify(FSI.getUserList())

@app.route('/api/data/songs/<songID>')
def get_song(songID):
    return jsonify(FSI.getSongInfo(songID))

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
