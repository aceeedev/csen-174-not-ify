#from song import Song
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


    ###The following functions have been moved to main.py:##
    ## Add to library, export to spotify, 
    ## get playlist, add song, remove song, 
    ## change cover, change title
