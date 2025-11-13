from typing import Any

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025

#TODO: Change owner_id to creator_id, because theoretically anybody can 'own' a copy of the playlist

class Playlist:
    def __init__(self, spotify_id: str, owner_id: str, title: str, cover: str, description: str, songs: list[str]) -> None:
        self.spotify_id = spotify_id
        self.owner_id = owner_id
        self.title = title
        self.cover = cover
        self.description = description
        self.songs = songs


    def to_dict(self) -> dict[str, Any]:
        return {
            "spotify_id": self.spotify_id, 
            "owner_id": self.owner_id,
            "title": self.title,
            "cover": self.cover,
            "description": self.description,
            "songs": self.songs   
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]):
        return cls(
            spotify_id=data['spotify_id'],
            owner_id=data['owner_id'],
            title=data['title'],
            cover=data['cover'],
            description=data['description'],
            songs=data['songs']  
        )
    
    def to_dict_with_id(self, firebase_id: str) -> dict[str, Any]:
        as_dict: dict[str, Any] = self.to_dict()

        as_dict["id"] = firebase_id

        return as_dict
