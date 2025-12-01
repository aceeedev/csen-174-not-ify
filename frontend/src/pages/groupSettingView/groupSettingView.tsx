/*THIS IS THE PAGE WHERE THE USER CAN VIEW AND SETTINGS as a group owner */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './groupSettingView.css';
import type { firebaseUser, Group } from '../../models';
import Navbar, { BackButtonLocation } from '../../components/Navbar';
import { editGroupOnBackend, getGroupMembersListOnBackend } from '../../backendInterface';


/**
 * Use like so:
 * 
 *  <Link to="/group/settings" state={{ group: group }}>
        To group's settings page
    </Link>
 */


function GroupSettingView() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const group = location.state?.group as Group | undefined;

  // TODO: Fetch members from backend
  const [members, setMembers] = useState<firebaseUser[]>([]);
  
  // Form state for group settings
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveSettings = () => {
    // TODO: Implement save group settings functionality
  };

  const handleRemoveMember = async (memberId: string) =>  {
    if (group?.id) {
      await editGroupOnBackend(group.id, "remove_user", memberId);

      // refetch members
      await setMembers(await getGroupMembersListOnBackend(group.id) ?? [])
    }
  };

  const handleDeleteGroup = async () => {
    if (!group?.id) {
      alert('Error: Group information not available');
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this group? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await editGroupOnBackend(group.id, 'del_group', '');
      
      if (result.success) {
        // Navigate to home page (IndexPage shows UserHomePage when logged in)
        navigate('/', { replace: true });
        // Show success message after navigation
        setTimeout(() => {
          alert('Group deleted successfully!');
        }, 100);
      } else {
        alert(`Error deleting group: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group. Please try again.');
    }
  };

  useEffect(() => {
    (async () => {
      if (group?.id) {
        await setMembers(await getGroupMembersListOnBackend(group.id) ?? [])
      }
    })();
  }, []);

  return (
    <div className="group-settings-container">
      <Navbar backButtonLocation={BackButtonLocation.ToGroup} />

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
                placeholder={group?.group_name || 'Enter group name'}
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
          </div>

          {members.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No members in this group</p>
            </div>
          ) : (
            <div className="members-list">
              {members.map((member) => (
                <div key={member.id} className="member-card">
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
                    <div className="member-name-row">
                      <h3 className="member-name">{member.name || 'Unknown User'}</h3>
                      {member.id === group?.owner_id && (
                        <span className="owner-badge">👑 Owner</span>
                      )}
                    </div>
                  </div>
                  <div className="member-actions">
                    {member.id === group?.owner_id? (
                      <span className="member-status">Owner</span>
                    ) : (
                      <>
                        <button
                          className="btn-action btn-remove"
                          onClick={() => { if (member.id) handleRemoveMember(member.id) }}
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
