from typing import Any, TYPE_CHECKING

if TYPE_CHECKING:
    from FireStoreInterface import FirebaseManager

#Changelog
#Update Code: Editor, date
#UC1: Katie, 10/29/2025


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
    
    def to_dict_with_id_and_owner_name(self, firebase_manager: "FirebaseManager", firebase_id: str) -> dict[str, Any]:
        as_dict: dict[str, Any] = self.to_dict()

        as_dict["id"] = firebase_id
        as_dict["owner_name"] = firebase_manager.get_user_info(self.owner_id).name

        return as_dict
