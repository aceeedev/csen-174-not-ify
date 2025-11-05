/*THIS IS THE PAGE WHERE THE USER CAN VIEW AND SETTINGS as a group owner */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './groupSettingView.css';

function GroupSettingView() {
  const { groupId } = useParams();
  
  // TODO: Fetch group data from backend
  const [group, setGroup] = useState<any>(null);
  
  // TODO: Fetch members from backend
  const [members, setMembers] = useState<any[]>([]);
  
  // Form state for group settings
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(20);
  const [maxPlaylists, setMaxPlaylists] = useState(20);

  const handleSaveSettings = () => {
    // TODO: Implement save group settings functionality
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implement remove member functionality
  };

  const handleDeleteGroup = () => {
    // TODO: Implement delete group functionality
  };

  const handleInviteMember = () => {
    // TODO: Implement invite member functionality
  };

  const handleChangeOwner = (memberId: string) => {
    // TODO: Implement change owner functionality
  };

  return (
    <div className="group-settings-container">
      {/* Navigation Bar */}
      <nav className="settings-navbar">
        <div className="nav-content">
          <Link to={`/groups/${groupId}`} className="back-link">← Back to Group</Link>
          <Link to="/" className="logo-link">
            <h1 className="logo">Not-ify</h1>
          </Link>
          <div className="nav-links">
            <Link to={`/groups/${groupId}`} className="btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="settings-content">
        <div className="settings-header">
          <h1 className="settings-title">Group Settings</h1>
          <p className="settings-subtitle">Manage your group settings and members</p>
        </div>

        {/* Group Settings Form */}
        <section className="settings-section">
          <h2 className="section-title">Group Information</h2>
          
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={group?.name || 'Enter group name'}
                className="form-input"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={group?.description || 'Enter group description'}
                className="form-textarea"
                maxLength={100}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="maxMembers">Max Members</label>
                <input
                  type="number"
                  id="maxMembers"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value) || 20)}
                  min={1}
                  max={20}
                  className="form-input"
                />
                <span className="form-hint">Between 1 and 20</span>
              </div>

              <div className="form-group">
                <label htmlFor="maxPlaylists">Max Playlists</label>
                <input
                  type="number"
                  id="maxPlaylists"
                  value={maxPlaylists}
                  onChange={(e) => setMaxPlaylists(parseInt(e.target.value) || 20)}
                  min={1}
                  max={20}
                  className="form-input"
                />
                <span className="form-hint">Between 1 and 20</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" onClick={handleSaveSettings}>
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Members Management Section */}
        <section className="members-section">
          <div className="section-header">
            <h2 className="section-title">Members ({members.length || 0})</h2>
            <button className="btn-primary" onClick={handleInviteMember}>
              + Invite Member
            </button>
          </div>

          {members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p className="empty-text">No members in this group</p>
            </div>
          ) : (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-card">
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
                    <div className="member-name-row">
                      <h3 className="member-name">{member.name || 'Unknown User'}</h3>
                      {member.isOwner && (
                        <span className="owner-badge">👑 Owner</span>
                      )}
                    </div>
                    <p className="member-email">{member.email || 'No email'}</p>
                  </div>
                  <div className="member-actions">
                    {member.isOwner ? (
                      <span className="member-status">Owner</span>
                    ) : (
                      <>
                        <button
                          className="btn-action btn-change-owner"
                          onClick={() => handleChangeOwner(member.id)}
                          title="Transfer ownership"
                        >
                          Make Owner
                        </button>
                        <button
                          className="btn-action btn-remove"
                          onClick={() => handleRemoveMember(member.id)}
                          title="Remove member"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Danger Zone */}
        <section className="danger-section">
          <h2 className="section-title danger-title">Danger Zone</h2>
          <div className="danger-content">
            <div className="danger-item">
              <div className="danger-info">
                <h3 className="danger-item-title">Delete Group</h3>
                <p className="danger-item-description">
                  Permanently delete this group. This action cannot be undone.
                </p>
              </div>
              <button className="btn-danger" onClick={handleDeleteGroup}>
                Delete Group
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GroupSettingView;
