import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.models.user_account import UserAccount

class TestUserAccount:
    def __init__(self):
        self.user = None
    
    def test_basic(self):
        # Create user
        self.user = UserAccount("Test", "spotify_123", "pic.jpg", is_admin=True)
        print(f"Created: {self.user.name}")
        
      

    def test_remove_group(self):
        print("TESTING REMOVE GROUP------------------")
        # Test not admin
        print("Test 1: Testing not admin------------------")
        self.user.isAdmin = False
        completed = self.user.remove_group("group_123")
        if not completed:
            print("Test passed: User is not admin")
        else:
            print("Test failed: User is not admin")

        #test admin
        print("Test 2: Testing admin------------------")
        self.user.isAdmin = True
        completed = self.user.remove_group("group_123")
        if completed:
            print("Test passed: User is admin")
        else:
            print("Test failed: User is admin")

        #test remove group that doesn't exist
        print("Test 3: Testing remove group that doesn't exist------------------")
        completed = self.user.remove_group("group_123")
        if not completed:
            print("Test passed: Group doesn't exist")
        else:
            print("Test failed: Group exists")

    def test_remove_user(self):
        print("TESTING REMOVE USER------------------")
        #test not admin
        print("Test 1: Testing remove user that doesn't exist------------------")
        completed = self.user.remove_user("user_123")
        if not completed:
            print("Test passed: User doesn't exist")
        else:
            print("Test failed: User exists")
        
        #test admin
        print("Test 2: Testing remove user that exists------------------")
        self.user.isAdmin = True
        completed = self.user.remove_user("user_123")
        if completed:
            print("Test passed: User removed")
        else:
            print("Test failed: User not removed")

        #test remove user that doesn't exist
        print("Test 3: Testing remove user that doesn't exist------------------")
        completed = self.user.remove_user("user_123")
        if not completed:
            print("Test passed: User doesn't exist")
        else:
            print("Test failed: User exists")


if __name__ == "__main__":
    tester = TestUserAccount()
    tester.test_basic()
    tester.test_remove_group()
    tester.test_remove_user()