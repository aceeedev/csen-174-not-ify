from src.models.song import Song
import random
import string

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025

class Playlist:
    def __init__(self, title: str, cover: str, description: str, publisher: str, plistID: str, songs: list[Song] = None ):
        self.title = title
        self.cover = cover
        self.description = description #UC1
        self.publisher = publisher #UC1 
        self.plistID = plistID
        self.songs = songs or []

    def __eq__(self, other) -> bool:
        # return self.title == other.title and self.cover == other.cover and self.description == other.description and self.publisher == other.publisher and self.songs == other.songs
        return self.plistID == other.plistID

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
