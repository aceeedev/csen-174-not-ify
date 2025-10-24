import random

class Group:

    def __new__(cls, songs: list[str], cover: str, title: str):
        print("-- New is called --")
        instance = super().__new__(cls) #idk if this is needed as a function? 
        return instance

    def __init__(self, ownerID: str, memberIDs: list[str], plistBoard: list[str], ownerUID: str, desc: str):
        self._ownerID = ownerID
        self._memberIDs = memberIDs
        self._plistBoard = plistBoard
        self._ownerUID = ownerUID
        self._description = desc
        self.maxPLists = 20
        self.maxMembers = 20
        self.groupID = ''.join (random.choices(string.digits, k=10)) #Make a random 10 digit groupID

    @classmethod

    def inviteMember(self, callerID: str, inviteeID: str):
        #Error Handling
        errorCaught: bool = False
        if callerID not in self._memberIDs:
            raise Exception("User {callerID} is not a member of group {self.groupID}")
            errorCaught = True
        if inviteeID in self._memberIDs: 
            raise Exception("User {inviteeID} is already a member of group {self.groupID}")
            errorCaught = True
        if len(self._memberIDs) == self.maxMembers:
            raise Exception("Group is already at maximum capacity, cannot add more members.")
            errorCaught = True
        if errorCaught: #Allows for multiple failure to be displayed. 
            return
        
        self._memberIDs.append(inviteeID) #add user
    

        
    
