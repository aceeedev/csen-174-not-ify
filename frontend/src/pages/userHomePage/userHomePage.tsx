/*THIS IS THE USERS HOME PAGE WHEN LOGGED IN*/

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './userHomePage.css';
import { getIdToken } from '../../firebase';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:5001';

function UserHomePage() {
  const navigate = useNavigate();
  // TODO: Fetch user's groups from backend
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  
  // TODO: Fetch user's library from backend
  const [library, setLibrary] = useState<any[]>([]);

  const handleCreateGroup = () => {
    navigate('/groups/new');
  };

  const handleViewLibrary = () => {
    // TODO: Navigate to library view
  };

  const handleViewGroup = (groupData: any) => {
    if (!groupData?.id) {
      return;
    }

    navigate(`/groups/${groupData.id}`, { state: { group: groupData } });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchGroups = async () => {
      setIsLoadingGroups(true);
      setGroupsError(null);

      try {
        const token = await getIdToken();

        if (!token) {
          if (isMounted) {
            setGroupsError('Please sign in to view your groups.');
            setGroups([]);
          }
          return;
        }

        const baseUrl = API_BASE_URL.endsWith('/')
          ? API_BASE_URL.slice(0, -1)
          : API_BASE_URL;

        const response = await fetch(`${baseUrl}/get/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          let message = 'Unable to load groups.';
          try {
            const data = await response.json();
            if (data?.error) {
              message = data.error;
            }
          } catch (parseError) {
            console.error('Failed to parse groups response:', parseError);
          }

          throw new Error(message);
        }

        const data = await response.json();

        if (isMounted) {
          const mappedGroups = Array.isArray(data)
            ? data.map((groupItem: any) => ({
                ...groupItem,
                id: groupItem.id,
              }))
            : [];
          setGroups(mappedGroups);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
        if (isMounted) {
          setGroupsError(
            error instanceof Error
              ? error.message
              : 'Something went wrong while loading groups.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingGroups(false);
        }
      }
    };

    fetchGroups();

    return () => {
      isMounted = false;
    };
  }, []);

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
            {isLoadingGroups ? (
              <div className="status-message">Loading groups…</div>
            ) : groupsError ? (
              <div className="status-message error">{groupsError}</div>
            ) : groups.length === 0 ? (
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
                  onClick={() => handleViewGroup(group)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleViewGroup(group);
                    }
                  }}
                >
                  <div className="group-icon">🎵</div>
                  <h3 className="group-name">{group.name || 'Untitled Group'}</h3>
                  <p className="group-members">{group.memberCount || 0} members</p>
                  <p className="group-description">{group.description || 'No description'}</p>
                  <div className="group-actions">
                    <Link
                      to={`/groups/${group.id}`}
                      className="group-link"
                      state={{ group }}
                    >
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
