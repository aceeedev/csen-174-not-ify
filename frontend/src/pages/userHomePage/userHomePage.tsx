/*THIS IS THE USERS HOME PAGE WHEN LOGGED IN*/

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './userHomePage.css';

function UserHomePage() {
  const navigate = useNavigate();
  // TODO: Fetch user's groups from backend
  const [groups, setGroups] = useState<any[]>([]);
  
  // TODO: Fetch user's library from backend
  const [library, setLibrary] = useState<any[]>([]);

  const handleCreateGroup = () => {
    // TODO: Implement create group functionality
  };

  const handleViewLibrary = () => {
    // TODO: Navigate to library view
  };

  const handleViewGroup = (groupId: string) => {
    if (!groupId) {
      return;
    }

    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="user-home-container">
      {/* Navigation Bar */}
      <nav className="user-navbar">
        <div className="nav-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">Not-ify</h1>
          </Link>
          <div className="nav-links">
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/login" className="btn-secondary">Sign Out</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="user-home-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="welcome-title">Welcome Back!</h1>
          <p className="welcome-subtitle">Manage your groups and explore your library</p>
        </section>

        {/* Groups Section */}
        <section className="groups-section">
          <div className="section-header">
            <h2 className="section-title">Your Groups</h2>
            <button className="btn-primary" onClick={handleCreateGroup}>
              + Create Group
            </button>
          </div>

          <div className="groups-grid">
            {groups.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p className="empty-text">You're not in any groups yet</p>
                <button className="btn-primary" onClick={handleCreateGroup}>
                  Create Your First Group
                </button>
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="group-card"
                  onClick={() => handleViewGroup(group.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleViewGroup(group.id);
                    }
                  }}
                >
                  <div className="group-icon">🎵</div>
                  <h3 className="group-name">{group.name || 'Untitled Group'}</h3>
                  <p className="group-members">{group.memberCount || 0} members</p>
                  <p className="group-description">{group.description || 'No description'}</p>
                  <div className="group-actions">
                    <Link to={`/groups/${group.id}`} className="group-link">
                      View Group →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="section-footer">
            <Link to="/groups" className="view-all-link">
              View All Groups →
            </Link>
          </div>
        </section>

        {/* Library Section */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">Your Library</h2>
            <button className="btn-secondary" onClick={handleViewLibrary}>
              View Full Library →
            </button>
          </div>

          <div className="library-preview">
            {library.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <p className="empty-text">Your library is empty</p>
                <Link to="/library" className="btn-primary">
                  Explore Library
                </Link>
              </div>
            ) : (
              <div className="library-grid">
                {library.slice(0, 6).map((item) => (
                  <div key={item.id} className="library-item">
                    <div className="library-item-cover">
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} />
                      ) : (
                        <div className="library-placeholder">🎵</div>
                      )}
                    </div>
                    <h4 className="library-item-title">{item.title || 'Untitled'}</h4>
                    <p className="library-item-artist">{item.artist || 'Unknown Artist'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="section-footer">
            <Link to="/library" className="view-all-link">
              View Full Library →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserHomePage;
