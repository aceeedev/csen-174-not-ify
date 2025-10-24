import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.models.user_account import UserAccount
from src.types.user_types import AdminComplaint


user = UserAccount("Test", "spotify_123", "pic.jpg", is_admin=False)

complaint_1 = AdminComplaint(
    id = '1',
    complainant_id = '123',
    target_user_id = 'user_2',
    group_id = 'group_2',
    description = 'User keeps spamming Take On Me'
)
complaint_2 = AdminComplaint(
    id = '2',
    complainant_id = '456',
    target_user_id = 'user_3',
    group_id = 'group_5',
    description = 'User was being hostile'
)
complaint_3 = AdminComplaint(
    id = '3',
    complainant_id = '789',
    target_user_id = 'user_2',
    group_id = 'group_2',
    description = 'Want user banned for inappropriate content'
)


user.create_complaint(complaint_1)

# TEST 1: make sure the complaint was added
assert len(user.myComplaints) == 1
assert user.myComplaints[0].id == '1'

# TEST 2: remove the complaint that was just added
user.remove_complaint('1')

assert len(user.myComplaints) == 0

# TEST 3: add 3 complaints and remove the middle one
user.create_complaint(complaint_1)
user.create_complaint(complaint_2)
user.create_complaint(complaint_3)

assert len(user.myComplaints) == 3
assert user.myComplaints[1].id == '2'

user.remove_complaint('1')
user.remove_complaint('3')

assert user.myComplaints[0].id == '2'

user.remove_complaint('2') # reset to 0 compliants

# TEST 4: try to remove a complaint when there is none
user.remove_complaint('999')

assert len(user.myComplaints) == 0

# TEST 4: try to remove a complaint when it does not exist
user.create_complaint(complaint_3)
user.remove_complaint('123')

assert len(user.myComplaints) == 1
assert user.myComplaints[0].id == '3'
