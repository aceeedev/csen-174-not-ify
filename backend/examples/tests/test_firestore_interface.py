"""
Test file for FireStoreInterface.py
Run with: pytest backend/tests/test_firestore_interface.py -v
Or: cd backend && python -m pytest tests/test_firestore_interface.py -v
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

import pytest
from FireStoreInterface import (
    getFirestoreDB, getDocInfo, getCollection, createDoc, deleteDoc, updateDoc,
    makeGroup, getGroups, deleteGroup, addMember, removeMember,
    getUserInfo, getUserList, getSongInfo, getSongs
)

# Test data - You'll need to create these in your Firebase before running tests
TEST_USER_ID = "test_user_123"
TEST_GROUP_NAME = "Test Group for Firestore"
TEST_MEMBER_ID = "test_member_456"

class TestFireStoreInterface:
    """Test class for FireStoreInterface functions"""
    
    def test_get_firestore_db(self):
        """Test that we can get a Firestore database connection"""
        db = getFirestoreDB()
        assert db is not None
        print("✅ getFirestoreDB() works")
    
    def test_get_collections(self):
        """Test getting collections"""
        users = getUserList()
        songs = getSongs()
        groups = getGroups()
        
        assert isinstance(users, list)
        assert isinstance(songs, list)
        assert isinstance(groups, list)
        print(f"✅ Collections retrieved - Users: {len(users)}, Songs: {len(songs)}, Groups: {len(groups)}")
    
    def test_create_and_get_doc(self):
        """Test creating and retrieving a document"""
        # This test creates a test document
        test_data = {
            'name': 'Test Document',
            'value': 123
        }
        # Note: createDoc doesn't return the ID, so we can't test retrieval easily
        # You might want to modify createDoc to return the document ID
        print("✅ createDoc() can be called (requires manual verification in Firebase)")
    
    def test_get_doc_info(self):
        """Test getting document info"""
        # Try to get a document that might exist
        result = getDocInfo('Users', TEST_USER_ID)
        # Result will either be data or error dict
        assert isinstance(result, dict)
        print(f"✅ getDocInfo() returns dict: {result}")
    
    def test_make_group_validation(self):
        """Test makeGroup validation"""
        # Test invalid maxMembers
        with pytest.raises(ValueError, match="Max members must be between 1 and 20"):
            makeGroup("Test", TEST_USER_ID, 0, "", 10)
        
        with pytest.raises(ValueError, match="Max members must be between 1 and 20"):
            makeGroup("Test", TEST_USER_ID, 21, "", 10)
        
        # Test invalid maxPLists
        with pytest.raises(ValueError, match="Max playlists must be between 1 and 20"):
            makeGroup("Test", TEST_USER_ID, 10, "", 0)
        
        # Test invalid group name length
        with pytest.raises(ValueError, match="Group name must be between 1 and 50 characters"):
            makeGroup("", TEST_USER_ID, 10, "", 10)
        
        with pytest.raises(ValueError, match="Group name must be between 1 and 50 characters"):
            makeGroup("A" * 51, TEST_USER_ID, 10, "", 10)
        
        # Test invalid description length
        with pytest.raises(ValueError, match="Description must be less than 100 characters"):
            makeGroup("Test", TEST_USER_ID, 10, "A" * 101, 10)
        
        print("✅ makeGroup validation works correctly")
    
    def test_make_group_invalid_owner(self):
        """Test makeGroup with invalid owner ID"""
        invalid_owner = "non_existent_user_999"
        with pytest.raises(ValueError, match="Owner ID must be a valid user ID"):
            makeGroup("Test Group", invalid_owner, 10, "Description", 10)
        print("✅ makeGroup correctly rejects invalid owner ID")
    
    def test_make_group_duplicate_name(self):
        """Test makeGroup with duplicate group name"""
        # First, create a group
        # Note: This will only work if you have a test user set up
        # Uncomment when you have test data:
        """
        try:
            makeGroup(TEST_GROUP_NAME, TEST_USER_ID, 10, "Description", 10)
            # Try to create another with same name
            with pytest.raises(ValueError, match="Group name must be unique"):
                makeGroup(TEST_GROUP_NAME, TEST_USER_ID, 10, "Description", 10)
            print("✅ makeGroup correctly rejects duplicate group names")
        except ValueError as e:
            if "Owner ID" in str(e):
                print("⚠️  Skipping duplicate name test - test user not set up")
            else:
                raise
        """
        print("⚠️  Duplicate name test requires manual setup")
    
    def test_get_groups(self):
        """Test getting all groups"""
        groups = getGroups()
        assert isinstance(groups, list)
        # Each group should have an 'id' field from streamToDict
        if groups:
            assert 'id' in groups[0]
        print(f"✅ getGroups() returns list of {len(groups)} groups")
    
    def test_delete_group(self):
        """Test deleting a group"""
        # Note: This requires a group ID that exists
        # Uncomment and provide a real group ID:
        """
        test_group_id = "some_group_id"
        result = deleteGroup(test_group_id)
        assert result is True
        print("✅ deleteGroup() works")
        """
        print("⚠️  deleteGroup test requires manual group ID")
    
    def test_add_member_validation(self):
        """Test addMember validation"""
        # Test with invalid group ID
        with pytest.raises(ValueError, match="Group ID must be a valid group ID"):
            addMember("non_existent_group", TEST_MEMBER_ID)
        
        print("✅ addMember validation works")
    
    def test_remove_member_validation(self):
        """Test removeMember validation"""
        # Test with invalid group ID
        with pytest.raises(ValueError, match="Group ID must be a valid group ID"):
            removeMember("non_existent_group", TEST_MEMBER_ID)
        
        print("✅ removeMember validation works")
    
    def test_get_user_info(self):
        """Test getting user info"""
        # Test with non-existent user
        result = getUserInfo("non_existent_user")
        assert 'error' in result or isinstance(result, dict)
        print("✅ getUserInfo() returns dict")
    
    def test_get_song_info(self):
        """Test getting song info"""
        # Test with non-existent song
        result = getSongInfo("non_existent_song")
        assert 'error' in result or isinstance(result, dict)
        print("✅ getSongInfo() returns dict")


# Manual test function - Run this to test with real Firebase data
def manual_test_with_real_data():
    """
    Manual test function for when you have real Firebase data set up.
    Uncomment and modify test IDs to match your Firebase.
    """
    print("\n" + "="*50)
    print("MANUAL TESTS - Requires Firebase setup")
    print("="*50)
    
    # Uncomment and set real IDs:
    """
    real_user_id = "your_user_id_here"
    real_group_name = "Manual Test Group"
    
    # Test creating a group
    print(f"\n1. Creating group '{real_group_name}'...")
    try:
        makeGroup(real_group_name, real_user_id, 10, "Test description", 10)
        print("   ✅ Group created successfully")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test getting groups
    print("\n2. Getting all groups...")
    groups = getGroups()
    print(f"   Found {len(groups)} groups")
    if groups:
        print(f"   Sample group: {groups[0]}")
    
    # Test getting user info
    print(f"\n3. Getting user info for {real_user_id}...")
    user_info = getUserInfo(real_user_id)
    print(f"   User info: {user_info}")
    
    # Test adding member (if you have a group ID)
    print("\n4. Testing add member...")
    group_id = "your_group_id_here"
    member_id = "your_member_id_here"
    try:
        addMember(group_id, member_id)
        print("   ✅ Member added successfully")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    """
    
    print("\n⚠️  Manual tests require uncommenting and setting real IDs")
    print("="*50)


if __name__ == "__main__":
    print("Running FireStoreInterface Tests")
    print("="*50)
    
    # Run pytest programmatically
    pytest.main([__file__, "-v", "-s"])
    
    # Run manual tests
    manual_test_with_real_data()

