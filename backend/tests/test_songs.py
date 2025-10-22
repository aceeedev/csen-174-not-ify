from src.models.song import Song

test_song = Song(
    spotifyID='0HNvAJA81ISxpjBFutadZd',
    cover='https://i.scdn.co/image/ab67616d00001e02e8dd4db47e7177c63b0b7d53',
    artistName='a-ha',
    title='Take On Me'
)

# TEST 1: create a song object and make sure it is properly created
assert test_song == Song(
    spotifyID='0HNvAJA81ISxpjBFutadZd',
    cover='https://i.scdn.co/image/ab67616d00001e02e8dd4db47e7177c63b0b7d53',
    artistName='a-ha',
    title='Take On Me'
)

test_song = Song.search_song('Bohemian Rhapsody')

# TEST 2: make sure a song is returned from search
assert test_song is not None

# TEST 3: make sure the correct song is returned
assert test_song.title == 'Bohemian Rhapsody'
assert test_song.artistName == 'Queen'

# TEST 4: make sure a song that does not exist is handled
test_song = Song.search_song('Bohemian Rhaps')

assert test_song is None

# TEST 5: create a song object missing all attributes
test_song = Song() # should raise TypeError!
