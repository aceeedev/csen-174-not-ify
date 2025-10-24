import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pytest
from src.models.song import Song
from src.models.playlist import Playlist

song_1 = Song(
    spotifyID='0HNvAJA81ISxpjBFutadZd',
    cover='https://i.scdn.co/image/ab67616d00001e02e8dd4db47e7177c63b0b7d53',
    artistName='a-ha',
    title='Take On Me'
)

song_2 = Song(
    spotifyID='1234567890',
    cover='https://image.com',
    artistName='artist name',
    title='song title'
)

def test_playlist_constructor():
    test_playlist = Playlist(
        title='My Playlist',
        cover='https://playlistcover.com',
        songs=[song_1, song_2]
    )

    assert test_playlist == Playlist(
        title='My Playlist',
        cover='https://playlistcover.com',
        songs=[song_1, song_2]
    )

def test_playlist_missing_attributes():
    with pytest.raises(TypeError):
        test_playlist = Playlist()

def test_add_one_song_from_empty():
    test_playlist = Playlist(
        title='My Playlist',
        cover='https://playlistcover.com'
    )

    test_playlist.add_song(song_1)

    assert len(test_playlist.songs) == 1
    assert test_playlist.songs[0] == song_1

def test_adding_and_removing_multiple_songs():
    test_playlist = Playlist(
        title='My Playlist',
        cover='https://playlistcover.com'
    )

    test_playlist.add_song(song_1)
    test_playlist.add_song(song_2)

    assert len(test_playlist.songs) == 2
    assert test_playlist.songs[1] == song_2

    test_playlist.remove_song(song_1)

    assert len(test_playlist.songs) == 1
    assert test_playlist.songs[0] == song_2

    test_playlist.remove_song(song_2)

    assert len(test_playlist.songs) == 0

def test_change_playlist_title_and_cover():
    test_playlist = Playlist(
        title='My Playlist',
        cover='https://playlistcover.com'
    )

    test_playlist.change_title('New Title')
    test_playlist.change_cover('https://newcover.com')

    assert test_playlist.title == 'New Title'
    assert test_playlist.cover == 'https://newcover.com'