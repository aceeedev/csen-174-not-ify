class Playlist:
    def __init__(self, songs: list[str], cover: str, title: str):
        """
        Initialize a Playlist instance.

        Args:
            songs (list[str]): List of song IDs in the playlist.
            cover (str): URL or file path to the playlist cover image.
            title (str): Title of the playlist.
        """
        self.songs = songs
        self.cover = cover
        self.title = title


    def get_songs(self) -> list[str]:
        """Return the list of song IDs."""
        return self.songs
    
    def get_title(self) -> str:
        return self.title
    def get_coverArt(self) -> str:
        return self.get_coverArt

    def get_artistName(self) -> list[str]:
        """Return the list of song IDs."""
        pass

    def __str__(self) -> str:
        """Return a string representation of the playlist."""
        pass

songsArr = ["rumors","dynamite", "chain", "born in the usa", "silver springs"]
testPlaylist = Playlist(["rumors", "chain", "silver springs"], "coverArt.png", "rumors")
def isValidSong(song) -> bool:
    if song in songsArr:
        return True
    else:
        return False

#test 1
assert testPlaylist.get_songs() is not None
print("test1 passed, songs array exists")

#test 2
assert len(testPlaylist.get_songs()) != 0
print("test2 passed, songs array isn't length 0")

#test 3
assert testPlaylist.get_title() is not None
print("test3 passed, title exists")

#test 4
assert testPlaylist.get_coverArt() is not None
print("test4 passed, coverArt is not none")

#test 5
songs = testPlaylist.get_songs()
for song in songs:
    assert isValidSong(song)
print("test5 passed, songs are valid")
