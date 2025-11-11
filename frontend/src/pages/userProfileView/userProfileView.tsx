/*THIS IS THE PAGE WHERE THE USER CAN VIEW THEIR PROFILE */
import React, { useState, useEffect } from 'react';
import './userProfileView.css';
import Navbar from "../../components/Navbar";
import { auth, authProvider, db } from '../../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';



//Katie Carter 11/9/2025 Notes:
// Commented out the coins information, as coins are a per-group item and are not global
// removed 'buying coins' functionality, buying coins is not a function that can be done in this app. 

/*
const GroupRow: React.FC = (props) =>{
  //react props w3schools
  return(
    <div>
      <h2> {props.groupDescr}</h2> //fUser ? fUser["my_groups"] : ""
      <button onClick={/*() => deleteGroup(groupName)}>Delete </button>
    </div>
  );
}


//onClick = a function, not the return result of a function. 
function deleteGroup(groupName){
  return;
}

*/
function UserProfileView() {
  const [aUser, setUser] = useState<any>(null) //google user
  const [fUser, setfUser] = useState<any>(null) //firebase user

  //Use effect for the google user and firebase user
  useEffect(() => { //subscribes to the firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); //updates the user variable on login/out\
      if (currentUser !== null){
        getUserObjectData(currentUser); //call this function at the start of the load. keep
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserObjectData= async (user: User) =>{ //should give me instance of user object imo
    const userId = user.uid;
    const userDocRef = doc(db, "Users", userId);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setfUser(userData); //sets the firebase user data from the firebase user object
      }
    } catch (error) {
      console.error("Error checking Firestore document:", error);
    }
  }

  const getGroups = async(user: User)=>{
    const userID = user.uid
    const response = await fetch(`http://localhost:5000/get/groups?user_id=${userID}`) //get the data, list of group objects
    await response.json()
    return 
  }

  const leaveGroup = async()=>{

  }

  return (
    <div>
      <Navbar></Navbar>

      {/** Settings */}
      <section id="user-settings" className="user-settings-section">
        <h2 className="section-title">Settings</h2>
        <div className='user-settings-grid'>
          {/* Get each group using the function get_groups from the backend and store into a list */}
          {/* for each, iterate over each group in the list of groups retrieved from the above*/}
          {fUser ? fUser["my_groups"] : ""}
          
          {/* <GroupRow></GroupRow>   */}

          {/*GroupRow takes an instance of a group object  */}
        </div>
      </section>
    </div>
  );
}


export default UserProfileView;
