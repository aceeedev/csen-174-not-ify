from song import Song
from typing import Any

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025

class Playlist:
    def __init__(self, spotifyID: str, ownerID: str, title: str, cover: str, description: str, publisher: str, songs: list[str] = []):
        self.spotifyID = spotifyID
        self.ownerID = ownerID
        self.title = title
        self.cover = cover
        self.description = description
        self.songs = songs

    def to_dict(self) -> dict[str, Any]:
        return {
            "spotifyID": self.spotifyID, 
            "ownerID": self.ownerID,
            "title": self.title,
            "cover": self.cover,
            "description": self.description,
            "songs": self.songs   
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            spotifyId=data['spotifyID'],
            ownerID=data['ownerID'],
            title=data['title'],
            cover=data['cover'],
            description=data['description'],
            songs=data['songs']  
        )


    ### OLD code that needs to be moved:
    def add_to_library(self, user): #UC1
        if self not in user.library:
            user.save_playlist(self)
        else:
            raise Exception("User {user} already has a copy of {self.title}")
            errorCaught = True


    def export_to_spotify(self, spotify_client):
        """Export the playlist to Spotify using the provided Spotify client."""
        pass

    def get_playlist(self):
        return self

    def add_song(self, song: Song):
        if song not in self.songs:
            self.songs.append(song)

    def remove_song(self, song: Song):
        self.songs = [obj for obj in self.songs if obj != song]


    def change_cover(self, new_cover: str):
        self.cover = new_cover

    def change_title(self, new_title: str):
        self.title = new_title
