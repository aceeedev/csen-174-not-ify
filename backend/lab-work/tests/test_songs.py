import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pytest
from src.models.song import Song


def test_song_constructor():
    """
    TEST 1: create a song object and make sure it is properly created
    """
    test_song = Song(
        spotifyID='0HNvAJA81ISxpjBFutadZd',
        cover='https://i.scdn.co/image/ab67616d00001e02e8dd4db47e7177c63b0b7d53',
        artistName='a-ha',
        title='Take On Me'
    )

    assert test_song == Song(
        spotifyID='0HNvAJA81ISxpjBFutadZd',
        cover='https://i.scdn.co/image/ab67616d00001e02e8dd4db47e7177c63b0b7d53',
        artistName='a-ha',
        title='Take On Me'
    )

def test_song_search_constructor():
    """
    TEST 2: search for a song and make sure it is properly created
    """
    test_song = Song.search_song('Bohemian Rhapsody')

    assert test_song is not None

def test_correct_song_searched():
    """
    TEST 3: make sure the correct song is returned when searched
    """
    test_song = Song.search_song('Bohemian Rhapsody')

    assert test_song.title == 'Bohemian Rhapsody'
    assert test_song.artistName == 'Queen'

def test_incorrect_song_searched():
    """
    TEST 4: make sure a song that does not exist is handled
    """
    test_song = Song.search_song('Bohemian Rhaps')

    assert test_song is None

def test_song_missing_attributes():
    """
    TEST 5: create a song object missing all attributes
    """
    with pytest.raises(TypeError):
        test_song = Song()
