/*THIS IS THE USERS HOME PAGE WHEN LOGGED IN*/

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './userHomePage.css';
import Navbar from '../../components/Navbar';
import { getLibraryPlaylistsOnBackend, getGroupsOnBackend } from '../../backendInterface';
import type { Group, Playlist } from '../../models';
import PlaylistCard from '../../components/PlaylistCard';
import { getCurrentUserFromFirebase } from '../../firebase';


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

  const handleJoinGroup = () => {
    navigate('/join-group');
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={handleJoinGroup}>
                🔑 Join Group
              </button>
              <button className="btn-primary" onClick={handleCreateGroup}>
                + Create Group
              </button>
            </div>
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
              groups.slice(0, 3).map((group) => (
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
            <Link to="/my-groups" className="view-all-link">
              View All Groups →
            </Link>
          </div>
        </section>

        {/* Library Section */}
        <section className="library-section">
          <div className="section-header">
            <h2 className="section-title">Your Library</h2>
          </div>

          <div className="library-preview">
            {isLoadingLibrary ? (
              <div className="status-message">Loading library…</div>
            ) : library.length === 0 ? (
              <div className="empty-state">
                <p className="empty-text">Your library is empty</p>
                <p className="empty-text">Join or Create a Group to add Playlists to your Library.</p>
              </div>
            ) : (
              <div className="playlist-board-grid">
                {library.slice(0, 3).map((item) => (
                  <PlaylistCard playlist={item}/>
                ))}
              </div>
            )}
          </div>

          <div className="section-footer">
            <Link to="/my-library" className="view-all-link">
              View Full Library →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserHomePage;
