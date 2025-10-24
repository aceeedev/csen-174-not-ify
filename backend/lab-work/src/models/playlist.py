from src.models.song import Song


class Playlist:
    def __init__(self, title: str, cover: str, songs: list[Song] = None):
        self.title = title
        self.cover = cover
        self.songs = songs or []


    def __eq__(self, other) -> bool:
        return self.songs == other.songs and self.cover == other.cover and self.title == other.title

    def export_to_spotify(self, spotify_client):
        """Export the playlist to Spotify using the provided Spotify client."""
        pass

    def add_song(self, song: Song):
        if song not in self.songs:
            self.songs.append(song)

    def remove_song(self, song: Song):
        self.songs = [obj for obj in self.songs if obj != song]


    def change_cover(self, new_cover: str):
        self.cover = new_cover

    def change_title(self, new_title: str):
        self.title = new_title
