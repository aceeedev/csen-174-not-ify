/*This is a group view page where the user can view a group and the playlist board and its members */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './groupView.css';

function GroupView() {
  const { groupId } = useParams();
  
  // TODO: Fetch group data from backend
  const [group, setGroup] = useState<any>(null);
  
  // TODO: Fetch members from backend
  const [members, setMembers] = useState<any[]>([]);
  
  // TODO: Fetch playlists from backend
  const [playlists, setPlaylists] = useState<any[]>([]);
  
  // TODO: Check if current user is owner
  const [isOwner, setIsOwner] = useState(false);

  const handleAddPlaylist = () => {
    // TODO: Implement add playlist functionality
  };

  const handleInviteMember = () => {
    // TODO: Implement invite member functionality
  };

  const handleViewPlaylist = (playlistId: string) => {
    // TODO: Navigate to playlist view
  };

  const handleViewMember = (memberId: string) => {
    // TODO: Navigate to member profile
  };

  const handleLeaveGroup = () => {
    // TODO: Implement leave group functionality
  };

  const handleSettings = () => {
    // TODO: Navigate to group settings (if owner)
  };

  return (
    <div className="group-view-container">
      {/* Navigation Bar */}
      <nav className="group-navbar">
        <div className="nav-content">
          <Link to="/userHomePage" className="back-link">← Back to Home</Link>
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

      {/* Group Header */}
      <section className="group-header">
        <div className="group-header-content">
          <div className="group-icon-large">🎵</div>
          <div className="group-info">
            <h1 className="group-title">{group?.name || 'Group Name'}</h1>
            <p className="group-description">{group?.description || 'No description available'}</p>
            <div className="group-meta">
              <span className="meta-item">👤 {members.length || 0} members</span>
              <span className="meta-item">🎵 {playlists.length || 0} playlists</span>
              {group?.owner && (
                <span className="meta-item">👑 Owner: {group.owner}</span>
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
                    <p className="playlist-owner">by {playlist.owner || 'Unknown'}</p>
                    <p className="playlist-songs">{playlist.songCount || 0} songs</p>
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
    </div>
  );
}

export default GroupView;
