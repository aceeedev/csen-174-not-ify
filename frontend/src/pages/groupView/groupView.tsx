/*This is a group view page where the user can view a group and the playlist board and its members */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './groupView.css';
import { auth, getUserFromFirebase,getCurrentUserFromFirebase } from '../../firebase';
import { takePlaylistFromGroupOnBackend, inviteToGroupOnBackend, getGroupPlaylistsOnBackend, getGroupMembersListOnBackend, getGroupInviteCodeOnBackend } from '../../backendInterface';
import type { Group, firebaseUser } from '../../models';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getGroupsOnBackend, editGroupOnBackend } from "../../backendInterface";
import Navbar, { BackButtonLocation } from '../../components/Navbar';
import PlaylistCard from '../../components/PlaylistCard';


/**
 * Use like so:
 * 
 *  <Link to="/group" state={{ group: group }}>
        To group's page
    </Link>
 */

function GroupView() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const group = location.state?.group as Group | undefined;
  const groupId = group?.id;

  const [members, setMembers] = useState<firebaseUser[]>([]);

  const [playlists, setPlaylists] = useState<any[]>([]);

  const [isOwner, setIsOwner] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [aUser, setUser] = useState<User | null>(null) //google authentication user
  const [fUser, setfUser] = useState<firebaseUser | null>(null)        //firebase user object

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);                           //updates the user variable on login/out

      if (currentUser !== null){
        getUserObjectData(currentUser);               //call this function at the start of the load. keep

        setIsOwner(group?.owner_id == currentUser.uid)
      }
        });

  const getUserObjectData= async (user: User) =>{     //firebase user
    setfUser (await getCurrentUserFromFirebase());
  }

    const fetchGroupDetails = async () => {
      if (!groupId) {
        setErrorMessage('No group selected.');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      setMembers(await getGroupMembersListOnBackend(groupId) ?? []);

      const playlistResponse = await getGroupPlaylistsOnBackend(groupId);

      if (playlistResponse && isMounted) {
          setPlaylists(playlistResponse);
      } else {
        console.warn('Unable to load group playlists.');
      }
        
      setIsLoading(false);
    };

    if (groupId) {
      fetchGroupDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [groupId, group]);

  const handleAddPlaylist = () => {
    if (!groupId) return;
    navigate('/add-playlist', { 
      state: { 
        group: group,
        groupID: groupId 
      } 
    });
  };

  const handleleaveGroup = async()=>{
      if (!aUser || !groupId) return;
      
      // Ask for confirmation first (Just to be sure)
      const confirmed = window.confirm("Are you sure you want to leave this group?");
      if (!confirmed) return;
  
      //remove user from the group on the backend.
      const response = await editGroupOnBackend(groupId, "remove_user", aUser.uid);
  
      if (response.success) {
        // Only remove from state after backend confirms success
        navigate("/")
      } else {
        alert("Could not leave group: " + response.message);
      }
    }

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showInviteCode, setShowInviteCode] = useState(false);

  const handleInviteMember = async () => {
    if (!groupId) return;
    
    // Fetch invite code if not already loaded
    if (!inviteCode && group?.invite_code) {
      setInviteCode(group.invite_code);
      setShowInviteCode(true);
      return;
    }
    
    if (!inviteCode) {
      try {
        const result = await getGroupInviteCodeOnBackend(groupId);
        if (result.success) {
          setInviteCode(result.data);
          setShowInviteCode(true);
        } else {
          alert(`Error: ${result.message || 'Failed to get invite code'}`);
        }
      } catch (error) {
        console.error('Error fetching invite code:', error);
        alert('Failed to get invite code');
      }
    } else {
      setShowInviteCode(true);
    }
  };

  const handleCopyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      alert('Invite code copied to clipboard!');
    }
  };

  const handleInviteMemberOld = async () => {
    if (!groupId) return;
    
    const userID = prompt("Enter the user ID (Firebase UID) of the person you want to invite:");
    if (!userID || userID.trim() === '') return;
    
    try {
      const result = await inviteToGroupOnBackend(groupId, userID.trim());
      
      if (result.success) {
        alert("User invited successfully!");
        // Refresh the group data
        window.location.reload();
      } else {
        alert(`Error: ${result.message || 'Failed to invite user'}`);
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Failed to invite user. Please try again.");
    }
  };

  const handleViewPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    navigate('/playlist', { 
      state: { 
        groupID: groupId,
        group: group,
        playlist: playlist
      } 
    });
  };


  const handleTakePlaylist = async (playlistId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the card click
    
    if (!groupId || !playlistId) return;

    try {
      const result = await takePlaylistFromGroupOnBackend(groupId, playlistId);
      
      if (result.success) {
        // Refresh the playlists to update the UI
        // You could also show a success message here
        window.location.reload(); // Simple refresh for now
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error taking playlist:', error);
      alert('Failed to take playlist');
    }
  };


  const handleSettings = () => {
    if (!groupId) return;

    navigate(`/group/settings`, { state: { group: group }});
  };

  return (
    <div className="group-view-container">
      <Navbar />

      {isLoading ? (
        <div className="group-status-message">Loading group...</div>
      ) : errorMessage ? (
        <div className="group-status-message error">{errorMessage}</div>
      ) : !group ? (
        <div className="group-status-message error">
          Unable to display this group.
        </div>
      ) : (
      <>
      
      {/* Group Header */}
      <section className="group-header">
        <div className="group-header-content">
          <div style={{
            textAlign: 'center'
          }}>
            {/* Group Name */}
            <span style={{
              fontSize: '3rem',
              textAlign: 'center'
            }}>
              {group?.group_name || 'Group Name'}
            </span>

            {/* Group Descritpion */}
            <p className="group-description">{group?.description || 'No description available'}</p>
            
            {/* Group Stats (Based on user stats) */}
            <div className="stats-container">
              <div className='stats-left'>
                <div>Group Members </div>
                <div>{members.length || 0}</div>
              </div>
              <div className="stats-center">♪</div>
              <div className='stats-right'>
                <div>Posted Playlists </div>
                <div>{playlists.length || 0}</div>
              </div>
            </div>

            {/* Coins that you have */}
            <div style = {{
              marginTop:  '1rem',
            }}> 
              {group && aUser && (
              <p>Your Coins: {group.group_member_data[aUser!.uid].coins}</p>
            )}
            </div>
          </div>
          
          <div className="group-actions-header">
            {isOwner && (
              <button className="btn-secondary" onClick={handleSettings}>
                Group Settings
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="group-content">
        {/* Playlist Board Section */}
        <section className="playlist-board-section">
          <div className="section-header">
            <h2 className="section-title">Playlist Board</h2>
            <button className="btn-primary" onClick={handleAddPlaylist}>
              + Add Playlist
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎵</div>
              <p className="empty-text">No playlists in this group yet</p>
              <button className="btn-primary" onClick={handleAddPlaylist}>
                Add First Playlist
              </button>
            </div>
          ) : (
            <div className="playlist-board-grid">
              {playlists.map((playlist) => (
                <PlaylistCard playlist={playlist} group={group} groupID={groupId}/>
              ))}
            </div>
          )}
        </section>

        {/* Invite Code Section */}
        {showInviteCode && inviteCode && (
          <section className="invite-code-section" style={{
            background: 'rgba(102, 126, 234, 0.1)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.9)' }}>Group Invite Code</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                letterSpacing: '0.5rem',
                color: '#667eea',
                fontFamily: 'monospace',
                padding: '1rem 2rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '2px dashed rgba(102, 126, 234, 0.5)'
              }}>
                {inviteCode}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button 
                className="btn-primary" 
                onClick={handleCopyInviteCode}
                style={{ marginRight: '0.5rem' }}
              >
                Copy Code
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => setShowInviteCode(false)}
              >
                Close
              </button>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Share this code with friends to invite them to your group!
            </p>
          </section>
        )}

        {/* Members Section */}
        <section className="members-section">
          <div className="section-header">
            <h2 className="section-title">Members ({members.length || 0})</h2>
            {isOwner && (
              <button className="btn-secondary" onClick={handleInviteMember}>
                Share Invite Code
              </button>
            )}
          </div>

          {members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p className="empty-text">No members in this group</p>
            </div>
          ) : (
            <div className="members-list">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="member-card"
                >
                  <div className="member-avatar">
                    {member.profile_pic ? (
                      <img src={member.profile_pic} alt={member.name} />
                    ) : (
                      <div className="member-placeholder">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name || 'Unknown User'}</h3>
                  </div>
                  <p>Coins: {group.group_member_data[member.id!].coins}</p>
                </div>
              ))}
            </div>
          )}

          {!isOwner && (
            <div className="leave-group-section">
              <button className="btn-danger" onClick={handleleaveGroup}>
                Leave Group
              </button>
            </div>
          )}
        </section>
      </div>
      </>
      )}
    </div>
  );
}

export default GroupView;
