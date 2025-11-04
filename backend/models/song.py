from typing import Any


class Song:
    def __init__(self, spotify_id: str, album_cover: str, album_name: str, artist_name: str, title: str) -> None:
        self.spotify_id = spotify_id
        self.album_cover = album_cover
        self.album_name = album_name
        self.artist_name = artist_name
        self.title = title


    def to_dict(self) -> dict[str, Any]:
        return {
            "spotify_id": self.spotify_id, 
            "album_cover": self.album_cover,
            "album_name": self.album_name,
            "artist_name": self.artist_name,
            "title": self.title
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            spotify_id=data['spotify_id'],
            album_cover=data['album_cover'],
            album_name=data['album_name'],
            artist_name=data['artist_name'],
            title=data['title']   
        )
