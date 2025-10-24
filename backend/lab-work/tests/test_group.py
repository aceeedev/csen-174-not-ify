import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pytest
from src.models.group import Group

def test_group_constructor():
    """
    TEST 1: create a song object and make sure it is properly created
    """
    test_group = Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )

    assert test_group == Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )

def test_inv_mem_correctly():
    """
    TEST 2: Invite a member successfully. 
    """
    test_group = Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )

    test_invite_mem = test_group.inviteMember('member1', 'member4')

    assert len(test_group._memberIDs) == 4
    assert test_group._memberIDs[3] == 'member4'


def test_inv_mem_not_member():
    """
    TEST 3: Try to invite a member into a group you are not a part of
    """
    test_group = Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )


    with pytest.raises(Exception):
        test_invite_mem = test_group.inviteMember('member5', 'member4')


def test_inv_mem_already_in():
    """
    TEST 4: Try to invite a member into a group that they are already in
    """
    test_group = Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )

    with pytest.raises(Exception):
        test_invite_mem = test_group.inviteMember('member3', 'member2')

def test_inv_mem_group_full():
    """
    TEST 5: Try to invite a member into a group that is already full
    """
    
    test_group = Group(
        ownerID = 'ownerisme',
        memberIDs = ['member1', 'member2', 'member3', 'member4', 'member5',
                     'member6', 'member7', 'member8', 'member9', 'member10',
                     'member11', 'member12', 'member13', 'member14', 'member15',
                     'member16', 'member17', 'member18', 'member19', 'member20'],
        plistBoard = ['plist1', 'plist2', 'plist3'],
        desc = 'This is our group for testing',
        groupName = 'Fabulous Test Group'
    )
    
    with pytest.raises(Exception):
        test_invite_mem = test_group.inviteMember('member1', 'member21')
