/*THIS IS THE PAGE WHERE THE USER CAN VIEW THEIR PROFILE */
import React, { useState, useEffect } from 'react';
import './userProfileView.css';
import Navbar from "../../components/Navbar";
import { auth, getCurrentUserFromFirebase} from '../../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { getGroupsOnBackend, editGroupOnBackend } from "../../backendInterface";
import type { Group, firebaseUser } from "../../models"

export default function UserProfileView() {
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



  const leaveGroup = async(groupId: string)=>{
    if (!aUser) return;
    
    // Ask for confirmation first (Just to be sure)
    const confirmed = window.confirm("Are you sure you want to leave this group?");
    if (!confirmed) return;

    //remove user from the group on the backend.
    const response = await editGroupOnBackend(groupId, "remove_user", aUser.uid);

    if (response.success) {
      // Only remove from state after backend confirms success
      setGroups (await getGroupsOnBackend() ?? []);
    } else {
      alert("Could not leave group: " + response.message);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      setUser(null);

      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  return (
    <div className="user-profile-container">
      <Navbar></Navbar>
      <div className="profile-content">
        {/* User Info */}
        {fUser && (
          <div className="profile-avatar-container">
            {/* Profile Picture */}
            <img
              src={fUser.profile_pic || '/default-avatar.png'}
              alt={`${fUser.name}'s profile`}
              className="profile-avatar-img"
            />

            {/* User Info */}
            <div className="profile-info">
              <h2 className="profile-name">{fUser.name}</h2>
            </div>

            {/* User Stats */}
            <div className="stats-container">
              <div className='stats-left'>
                <div>Playlists Posted</div>
                <div>{fUser.library.length}</div>
              </div>
              <div className="stats-center">♪</div>
              <div className='stats-right'>
                <div>Groups I'm In</div>
                <div>{fUser.my_groups.length}</div>
              </div>
            </div>
          </div>
        )}


        {/** Settings */}
        <section id="user-settings" className="user-settings-section">
          <h2 className="settings-section-title">Settings</h2>

          <div className='user-settings-grid'>
              {/* Render a GroupRow for each group */}
              <h3 className="settings-subsection-title" >Edit Groups</h3>

              {groups.length === 0 && (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>You are in no groups!</p>
              )}

              {groups.map(group => (
                <GroupRow
                  key={group.id}
                  group={group}
                  onLeave={leaveGroup}          
                />
              ))}
          </div>
        </section>

        {/* Sign Out -> Adopted from NavBar*/}
        <section className="danger-section">
          <h2 className="section-title danger-title">Danger Zone</h2>
          <div className="danger-content">
            <div className="danger-item">
              <div className="danger-info">
                <h3 className="danger-item-title">Sign Out of Bop Swap</h3>
                <p className="danger-item-description">
                  Signs you out, to see your account you need to log back in.
                </p>
              </div>
              <button className="btn-danger" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function GroupRow({ group, onLeave }: { group: Group; onLeave: (id: string) => void }) {
  return (
    <div className="group-row-style">
      <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
        <span style={{fontSize: 18}}>{group.group_name}</span>    {/* Display the group name */}
        <span style={{fontStyle:'italic'}}>{group.description}</span>
      </div>
      {/* Button to remove the user from the group */}
      <button onClick={() => onLeave(group.id!)}>
        Leave Group
      </button>
    </div>
  );
}



