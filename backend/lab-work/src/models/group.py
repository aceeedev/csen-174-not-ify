import random
import string

class Group:

    def __init__(self, ownerID: str, memberIDs: list[str], plistBoard: list[str], desc: str, groupName: str):
        self._ownerID = ownerID
        self._memberIDs = memberIDs
        self._plistBoard = plistBoard
        self._description = desc
        self._groupName = groupName
        self.maxPLists = 20
        self.maxMembers = 20
        self.groupID = ''.join (random.choices(string.digits, k=10)) #Make a random 10 digit groupID

    def __eq__(self, other) -> bool:
        return self._ownerID == other._ownerID, self._memberIDs ==  other._memberIDs, self._plistBoard == other._plistBoard, self._description == other._description, self._groupName == other._groupName

    def inviteMember(self, callerID: str, inviteeID: str):
        #Error Handling
        errorCaught: bool = False
        if callerID not in self._memberIDs:
            raise Exception("User {callerID} is not a member of group {self._groupName}")
            errorCaught = True
        if inviteeID in self._memberIDs: 
            raise Exception("User {inviteeID} is already a member of group {self._groupName}")
            errorCaught = True
        if len(self._memberIDs) == self.maxMembers:
            raise Exception("Group is already at maximum capacity, cannot add more members.")
            errorCaught = True
        if errorCaught: #Allows for multiple failure to be displayed. 
            return
        
        self._memberIDs.append(inviteeID) #add user
    

        
    
