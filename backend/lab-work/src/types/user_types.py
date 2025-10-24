class GroupMembership:
    def __init__(self, group_id: str, is_owner: bool):
        self.group_id = group_id
        self.is_owner = is_owner

class AdminComplaint:
    def __init__(self, id: str, complainant_id: str, target_user_id: str = None, group_id: str = None, description: str = ""):
        self.id = id
        self.complainant_id = complainant_id
        self.target_user_id = target_user_id
        self.group_id = group_id
        self.description = description

class SpotifyUser:
    def __init__(self, id: str, display_name: str, images: list = None):
        self.id = id
        self.display_name = display_name
        self.images = images or []
