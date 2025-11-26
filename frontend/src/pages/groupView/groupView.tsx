/*This is a group view page where the user can view a group and the playlist board and its members */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './groupView.css';
import { auth } from '../../firebase';
import { takePlaylistFromGroupOnBackend, inviteToGroupOnBackend, getGroupPlaylistsOnBackend } from '../../backendInterface';
import type { Group } from '../../models';


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

  // TODO: Fetch members from backend
  const [members, setMembers] = useState<any[]>([]);

  // TODO: Fetch playlists from backend
  const [playlists, setPlaylists] = useState<any[]>([]);

  // TODO: Check if current user is owner
  const [isOwner, setIsOwner] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useEffect(() => {
    let isMounted = true;

    const fetchGroupDetails = async () => {
      if (!groupId) {
        setErrorMessage('No group selected.');
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const currentUserId = auth.currentUser?.uid ?? null;

        if (isMounted) {
          setIsOwner(
            currentUserId != null && group.owner_id === currentUserId,
          );

          const memberEntries = group.group_member_data
            ? Object.entries(group.group_member_data)
            : [];

          const formattedMembers = memberEntries.map(
            ([memberId, memberData]: [string, any]) => ({
              id: memberId,
              coins: memberData?.coins ?? 0,
              lastPostingTimestamp: memberData?.last_posting_timestamp ?? null,
              takenPlaylists: memberData?.taken_playlists ?? [],
              postedPlaylists: memberData?.posted_playlists ?? [],
              isOwner: memberId === group.owner_id,
            }),
          );

          setMembers(formattedMembers);
        }

        try {

          const playlistResponse = await getGroupPlaylistsOnBackend(groupId);

          if (playlistResponse && isMounted) {
              setPlaylists(playlistResponse);
          } else {
            console.warn('Unable to load group playlists.');
          }
        } catch (playlistError) {
          console.error('Error loading playlists:', playlistError);
        }
      } catch (error) {
        console.error('Failed to load group data:', error);
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Failed to load group.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchGroupDetails();

    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const handleAddPlaylist = () => {
    if (!groupId) return;
    navigate('/add-playlist', { 
      state: { 
        group: group,
        groupID: groupId 
      } 
    });
  };

  const handleInviteMember = async () => {
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

  const handleViewMember = (_memberId: string) => {
    // TODO: Navigate to member profile
  };

  const handleLeaveGroup = () => {
    // TODO: Implement leave group functionality
  };

  const handleSettings = () => {
    if (!groupId) return;

    navigate(`/group/settings`, { state: { group: group }});
  };

  return (
    <div className="group-view-container">
      {/* Navigation Bar */}
      <nav className="group-navbar">
        <div className="nav-content">
          <Link to="/" className="back-link">← Back to Home</Link>
          <Link to="/" className="logo-link">
            <h1 className="logo">Not-ify</h1>
          </Link>
          <div className="nav-links">
            {isOwner && (
              <button className="btn-secondary" onClick={handleSettings}>
                Settings
              </button>
            )}
          </div>
        </div>
      </nav>

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
          <div className="group-icon-large">🎵</div>
          <div className="group-info">
            <h1 className="group-title">{group?.group_name || 'Group Name'}</h1>
            <p className="group-description">{group?.description || 'No description available'}</p>
            <div className="group-meta">
              <span className="meta-item">👤 {members.length || 0} members</span>
              <span className="meta-item">🎵 {playlists.length || 0} playlists</span>
              {group?.owner_id && (
                <span className="meta-item">👑 Owner: {group.owner_id}</span>
              )}
            </div>
          </div>
          <div className="group-actions-header">
            <button className="btn-primary" onClick={handleAddPlaylist}>
              + Add Playlist
            </button>
            {!isOwner && (
              <button className="btn-secondary" onClick={handleInviteMember}>
                Invite Member
              </button>
            )}
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
                <div
                  key={playlist.id}
                  className="playlist-card"
                  onClick={() => handleViewPlaylist(playlist.id)}
                >
                  <div className="playlist-cover">
                    {playlist.cover ? (
                      <img src={playlist.cover} alt={playlist.title} />
                    ) : (
                      <div className="playlist-placeholder">🎵</div>
                    )}
                  </div>
                  <div className="playlist-info">
                    <h3 className="playlist-title">{playlist.title || 'Untitled Playlist'}</h3>
                    <p className="playlist-owner">
                      {playlist.is_owner ? 'Your playlist' : `by ${playlist.owner_id || 'Unknown'}`}
                    </p>
                    <p className="playlist-songs">{playlist.songs?.length || 0} songs</p>
                    {playlist.is_taken ? (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '4px', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        Already Taken
                      </div>
                    ) : playlist.can_take ? (
                      <button 
                        className="btn-primary" 
                        onClick={(e) => handleTakePlaylist(playlist.id, e)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        Take Playlist (1 coin)
                      </button>
                    ) : null}
                    {playlist.is_owner && !playlist.is_taken && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Your playlist
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Members Section */}
        <section className="members-section">
          <div className="section-header">
            <h2 className="section-title">Members ({members.length || 0})</h2>
            {isOwner && (
              <button className="btn-secondary" onClick={handleInviteMember}>
                + Invite Member
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
              {members.map((member) => (
                <div
                  key={member.id}
                  className="member-card"
                  onClick={() => handleViewMember(member.id)}
                >
                  <div className="member-avatar">
                    {member.profilePic ? (
                      <img src={member.profilePic} alt={member.name} />
                    ) : (
                      <div className="member-placeholder">
                        {member.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="member-info">
                    <h3 className="member-name">{member.name || 'Unknown User'}</h3>
                    <p className="member-role">
                      {member.isOwner ? '👑 Owner' : 'Member'}
                    </p>
                  </div>
                  {member.isOwner && (
                    <div className="owner-badge">👑</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isOwner && (
            <div className="leave-group-section">
              <button className="btn-danger" onClick={handleLeaveGroup}>
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
