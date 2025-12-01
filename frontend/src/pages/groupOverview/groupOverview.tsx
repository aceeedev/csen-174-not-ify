/*THIS IS THE PAGE WHERE THE USER CAN VIEW THEIR PROFILE */
import React, { useState, useEffect } from 'react';
import '../../pages/groupOverview/groupOverview.css';
import Navbar from "../../components/Navbar";
import { auth, getCurrentUserFromFirebase} from '../../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { getGroupMembersListOnBackend, getGroupsOnBackend, getUsersPlaylistsOnBackend } from "../../backendInterface";
import type { Group, firebaseUser } from "../../models"

export default function GroupsOverview() {
  const [aUser, setUser] = useState<User | null>(null) //google authentication user
  const [fUser, setfUser] = useState<firebaseUser | null>(null)        //firebase user object
  const [groups, setGroups] = useState<Group[]>([]);     // Full group objects for display

  const navigate = useNavigate();


  //Use effect for the google user and firebase user
  useEffect(() => {                                   //subscribes to the firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);                           //updates the user variable on login/out

      if (currentUser !== null){
        getUserObjectData(currentUser);               //call this function at the start of the load. keep
      }

    });

    return () => unsubscribe();
  }, []);

  const getUserObjectData= async (user: User) =>{     //firebase user
    setfUser (await getCurrentUserFromFirebase());
    setGroups (await getGroupsOnBackend() ?? []);
  }

  return (
    <div className="groups-overview-container">
      <Navbar></Navbar>
      <div className="groups-content">
        {/** Settings */}
        <section id="user-settings" className="user-settings-section">
          <h2 className="title-section">My Groups</h2>

          <div className='user-groups-grid'>
              {/* Render a GroupOverRow for each group */}
              {groups.map(group => (
                <GroupOverRow
                  key={group.id}
                  group={group}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function GroupOverRow({ group }: { group: Group}) {
  const [firebase_members, setMembers] = useState<firebaseUser[]>([])

  useEffect(() =>{
    async function loadMembers(){
      setMembers(await getGroupMembersListOnBackend(group.id!) ?? []);
    };
    loadMembers();
  }, [group.id])


  return (
    <div className="group-row-style">
      <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
        <span style={{fontSize: 20, fontStyle: 'bold'}}>{group.group_name}</span>    {/* Display the group name */}
        <span style={{fontStyle:'italic'}}>{group.description}</span>
        <span>
          {firebase_members.map((member: firebaseUser, index) => (
            <span key={index}> 
            {/* Display the profile picture */}
            <img 
              src={member.profile_pic || '/default-avatar.png'} 
              style={{
                width: "1rem",
                height: "1rem",
                borderRadius: "50%",
              }} 
            />
            {" "}
            {/* Display the Member's Name */}
            {member.name}
            <br />
            </span>
          ))}
        </span>
        
      </div>
      {/* Button to link to the group */}
        <Link
        to="/group"
        state={{ group }}
        style={{ 
          borderRadius: "8px",
          border: "1px solid transparent",
          padding: "0.6em 1.2em",
          fontSize: "1em",
          fontWeight: 500,
          fontFamily: "inherit",
          backgroundColor: "#1a1a1a",
          cursor: "pointer",
          transition: "border-color 0.25s",
        }}
        >
        View Group
        </Link>
    </div>
  );
}