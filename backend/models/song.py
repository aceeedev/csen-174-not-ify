class Song:
    def __init__(self, spotifyID: str, cover: str, artistName: str, title: str) -> None:
        self.spotifyID = spotifyID
        self.cover = cover
        self.title = title
        self.artistName = artistName


    def __eq__(self, other) -> bool:
        return self.spotifyID == other.spotifyID and self.cover == other.cover and self.title == other.title and self.artistName == other.artistName

    @classmethod
    def search_song(self, query: str) :
        """
        Simulates a search
        """
        if query == 'Bohemian Rhapsody':
        
            return self(
                spotifyID='12345',
                cover='https://image.com',
                artistName='Queen',
                title='Bohemian Rhapsody'
            )

        else:
            return None
