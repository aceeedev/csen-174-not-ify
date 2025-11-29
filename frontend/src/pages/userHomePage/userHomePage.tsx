/*THIS IS THE USERS HOME PAGE WHEN LOGGED IN*/

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './userHomePage.css';
import Navbar from '../../components/Navbar';
import { getLibraryPlaylistsOnBackend, getGroupsOnBackend } from '../../backendInterface';
import type { Group, Playlist } from '../../models';


function UserHomePage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  
  const [library, setLibrary] = useState<Playlist[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState<boolean>(true);

  const handleCreateGroup = () => {
    navigate('/new-group');
  };

  const handleViewLibrary = () => {
    navigate('/library');
  };

  const handleViewPlaylist = (playlist: Playlist) => {
  if (!playlist?.id) {
    return;
  }

  navigate('/playlist', {
    state: {
      playlist,
      // No groupID => means its in library
    },
  });
};

  const handleViewGroup = (groupData: Group) => {
    if (!groupData?.id) {
      return;
    }

    navigate(`/group`, { state: { group: groupData } });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchGroups = async () => {
      setIsLoadingGroups(true);
      setGroupsError(null);

      try {

        const response = await getGroupsOnBackend();

        if (!response) {
          throw new Error('Unable to load groups.');
        }

        setGroups(response);
      
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

  // Fetch library playlists
  useEffect(() => {
    let isMounted = true;

    const fetchLibrary = async () => {
      setIsLoadingLibrary(true);

      try {
        const libraryData = await getLibraryPlaylistsOnBackend();
        
        if (isMounted) {
          setLibrary(libraryData || []);
        }
      } catch (error) {
        console.error('Error fetching library:', error);
      } finally {
        if (isMounted) {
          setIsLoadingLibrary(false);
        }
      }
    };

    fetchLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="user-home-container">
      <Navbar />

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
                  <h3 className="group-name">{group.group_name || 'Untitled Group'}</h3>
                  <p className="group-members">{group.member_ids.length || 0} members</p>
                  <p className="group-description">{group.description || 'No description'}</p>
                  <div className="group-actions">
                    <Link
                      to={`/groups`}
                      className="group-link"
                      state={{ group: group }}
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
            {isLoadingLibrary ? (
              <div className="status-message">Loading library…</div>
            ) : library.length === 0 ? (
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
                  <div 
                    key={item.id} 
                    className="library-item"
                    onClick={() => handleViewPlaylist(item)}
                    >
                    <div className="library-item-cover">
                      {item.cover ? (
                        <img src={item.cover} alt={item.title} />
                      ) : (
                        <div className="library-placeholder">🎵</div>
                      )}
                    </div>
                    <h4 className="library-item-title">{item.title || 'Untitled'}</h4>
                    <p className="library-item-artist">{item.description || 'No description'}</p>
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
