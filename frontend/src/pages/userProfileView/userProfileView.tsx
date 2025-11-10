/*THIS IS THE PAGE WHERE THE USER CAN VIEW THEIR PROFILE */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './userProfileView.css';
import { getIdToken } from '../../firebase';

//Katie Carter 11/9/2025 Notes:
// Commented out the coins information, as coins are a per-group item and are not global
// removed 'buying coins' functionality, buying coins is not a function that can be done in this app. 

function UserProfileView() {
  // TODO: Fetch user profile data from backend
  //?
  const [profile, setProfile] = useState<any>(null);

  const userID = getIdToken()
  console.log(userID)
  
  // TODO: Fetch user stats from backend
  //?
  const [stats, setStats] = useState<any>({
    groupsCount: 'null',
    playlistsCount: 'null',
    songsCount: 'null',
  });

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile page
  };

  // const handleEarnCoins = () => {
  //   // TODO: Show ways to earn coins
  // };

  const handleSettings = () => {
    const section = document.getElementById('user-settings');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dummy data for demonstration
  const dummyProfile = {
    id: 'user123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePic: 'https://via.placeholder.com/150/667eea/FFFFFF?text=JD',
    joinDate: Date.now() - 86400000 * 30, // 30 days ago
    spotifyConnected: true,
  };


  const displayProfile = profile || dummyProfile;
  // const displayStats = stats.coins !== undefined ? stats : dummyStats; //we shouldn't need coins
  // setStats(dummyStats);
  const displayStats = stats;


    
  // const displayStats = stats && Object.keys(stats).length > 0 ? stats : dummyStats;




  // Format join date
  const joinDate = new Date(displayProfile.joinDate || Date.now());
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="user-profile-container">
      {/* Navigation Bar */}
      <nav className="profile-navbar">
        <div className="nav-content">
          <Link to="/home" className="logo-link">
            <h1 className="logo">Not-ify</h1>
          </Link>
          <div className="nav-links">
            <Link to="/home" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="profile-content">
        {/* Profile Header */}
        <section className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {displayProfile.profilePic ? (
                <img src={displayProfile.profilePic} alt={displayProfile.name} />
              ) : (
                <div className="profile-placeholder">
                  {displayProfile.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <button className="btn-edit-avatar" onClick={handleEditProfile}>
              ✏️ Edit
            </button>
          </div>
          <div className="profile-info-section">
            <h1 className="profile-name">{displayProfile.name || 'User'}</h1>
            <p className="profile-email">{displayProfile.email || 'No email'}</p>
            <p className="profile-join-date">Member since {formattedJoinDate}</p>
            <div className="profile-status">
              {displayProfile.spotifyConnected ? (
                <span className="status-badge status-connected">
                  🟢 Spotify Connected
                </span>
              ) : (
                <span className="status-badge status-disconnected">
                  🔴 Spotify Not Connected
                </span>
              )}
            </div>
            <div className="profile-actions">
              <button className="btn-primary" onClick={handleEditProfile}>
                Edit Profile
              </button>
              <button className="btn-secondary" onClick={handleSettings}>
                Account Settings
              </button>
            </div>
          </div>
        </section>

        {/* Coins Section */}
        {/*
        <section className="coins-section">
          <div className="coins-header">
            <div className="coins-info">
              <h2 className="coins-title">Your Coins</h2>
              <p className="coins-description">
                Use coins to swap playlists with other users
              </p>
            </div>
            <div className="coins-display">
              <div className="coins-amount">
                <span className="coins-icon">🪙</span>
                <span className="coins-value">{displayStats.coins || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="coins-actions">
            <button className="btn-primary btn-buy-coins" onClick={handleBuyCoins}>
              💰 Buy Coins
            </button>
            <button className="btn-secondary btn-earn-coins" onClick={handleEarnCoins}>
              ⭐ Earn Coins
            </button>
          </div>
          
          <div className="coins-info-box">
            <h3 className="info-box-title">How Coins Work</h3>
            <ul className="coins-info-list">
              <li>💰 Spend coins to swap playlists with other users</li>
              <li>⭐ Earn coins by sharing your playlists</li>
              <li>🎵 Get coins when others use your playlists</li>
              <li>🎁 Bonus coins for active participation</li>
            </ul>
          </div>
        </section>
        */}

        {/* Statistics Section */}
        <section className="stats-section">
          <h2 className="section-title">Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">{displayStats.groupsCount || 0}</div>
                <div className="stat-label">Groups</div>
              </div>
              <Link to="/home" className="stat-link">View Groups →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{displayStats.playlistsCount || 0}</div>
                <div className="stat-label">Playlists</div>
              </div>
              <Link to="/library" className="stat-link">View Library →</Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎵</div>
              <div className="stat-content">
                <div className="stat-value">{displayStats.songsCount || 0}</div>
                <div className="stat-label">Total Songs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-value">0</div>
                <div className="stat-label">Playlist Swaps</div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Info Section */}
        <section className="account-section">
          <h2 className="section-title">Account Information</h2>
          <div className="account-info-grid">
            <div className="info-item">
              <label className="info-label">User ID</label>
              <div className="info-value">{displayProfile.id || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label className="info-label">Email</label>
              <div className="info-value">{displayProfile.email || 'N/A'}</div>
            </div>
            <div className="info-item">
              <label className="info-label">Member Since</label>
              <div className="info-value">{formattedJoinDate}</div>
            </div>
            <div className="info-item">
              <label className="info-label">Spotify Status</label>
              <div className="info-value">
                {displayProfile.spotifyConnected ? (
                  <span className="status-connected">Connected</span>
                ) : (
                  <span className="status-disconnected">Not Connected</span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="user-settings" className="user-settings-section">
          <h2 className="section-title">Settings</h2>
          <div className='user-settings-grid'>
            
          </div>
        </section>

        {/* Quick Actions Section */} 
        {/* I don't understand this, these functions shouldn't link to another page*/}
        
        {/* <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/home" className="action-card">
              <div className="action-icon">👥</div>
              <h3 className="action-title">View Groups</h3>
              <p className="action-description">See all your groups</p>
            </Link>
            <Link to="/library" className="action-card">
              <div className="action-icon">📚</div>
              <h3 className="action-title">View Library</h3>
              <p className="action-description">Browse your playlists</p>
            </Link>
            {/* Comment the coins out separately if keeping quick actions 
            <button className="action-card" onClick={handleBuyCoins}>
              <div className="action-icon">💰</div>
              <h3 className="action-title">Buy Coins</h3>
              <p className="action-description">Get more coins</p>
            </button>
           
            <button className="action-card" onClick={handleSettings}>
              <div className="action-icon">⚙️</div>
              <h3 className="action-title">Settings</h3>
              <p className="action-description">Manage your account</p>
            </button>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default UserProfileView;
