from typing import Any

class Song:
    def __init__(self, spotifyID: str, albumCover: str, albumName: str, artistName: str, title: str) -> None:
        self.spotifyID = spotifyID
        self.albumCover = albumCover
        self.albumName = albumName
        self.title = title
        self.artistName = artistName


    def to_dict(self) -> dict[str, Any]:
        return {
            "spotifyID": self.spotifyID, 
            "albumCover": self.albumCover,
            "albumName": self.albumName,
            "title": self.title,
            "artistName": self.artistName
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            spotifyId=data['spotifyID'],
            albumCover=data['albumCover'],
            albumName=data['albumName'],
            title=data['title'],
            artistName=data['artistName']   
        )
