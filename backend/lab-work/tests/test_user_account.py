import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pytest
from src.models.user_account import UserAccount


def test_user_constructor():
    test_user = UserAccount("Test", "spotify_123", "pic.jpg", is_admin=True)

    assert test_user == UserAccount("Test", "spotify_123", "pic.jpg", is_admin=True)

def test_user_missing_attributes():
    with pytest.raises(TypeError):
        test_user = UserAccount()

def test_user_attributes():
    test_user = UserAccount("Fred", "my_cool_id", "awesome_pic.jpg", is_admin=True)

    assert test_user.name == "Fred"
    assert test_user.spotify_id == "my_cool_id"
    assert test_user.profile_pic == "awesome_pic.jpg"
    assert test_user.isAdmin == True
    assert test_user.myGroups == []
    assert test_user.myComplaints == []

def test_user_responding_to_complaint():
    test_user = UserAccount("Test", "spotify_123", "pic.jpg", is_admin=False)

    assert not test_user.respond_to_complaint('123', 'Complaint has been resolved', 'warn')

def test_admin_responding_to_complaint():
    test_user = UserAccount("Test", "spotify_123", "pic.jpg", is_admin=True)

    assert test_user.respond_to_complaint('123', 'Complaint has been resolved', 'warn')

