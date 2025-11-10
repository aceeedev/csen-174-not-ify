/*THIS IS THE PAGE WHERE THE USER CAN VIEW THEIR LIBRARY */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './libraryView.css';

function LibraryView() {
  // TODO: Fetch user's library from backend
  const [library, setLibrary] = useState<any[]>([]);
  
  // Search/filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'artist'>('name');

  const handleViewPlaylist = (playlistId: string) => {
    // TODO: Navigate to playlist view
  };

  const handleAddPlaylist = () => {
    // TODO: Implement add playlist functionality (from Spotify)
  };

  const handleDeletePlaylist = (playlistId: string) => {
    // TODO: Implement delete playlist functionality
  };

  // Filter and sort library
  const filteredLibrary = library.filter((playlist) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      playlist.title?.toLowerCase().includes(query) ||
      playlist.artist?.toLowerCase().includes(query) ||
      playlist.description?.toLowerCase().includes(query)
    );
  });

  const sortedLibrary = [...filteredLibrary].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.title || '').localeCompare(b.title || '');
      case 'date':
        return (b.dateAdded || 0) - (a.dateAdded || 0);
      case 'artist':
        return (a.artist || '').localeCompare(b.artist || '');
      default:
        return 0;
    }
  });

  // Dummy data for demonstration
  const dummyLibrary = [
    { id: 'p1', title: 'My Discoveries', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/FF5733/FFFFFF?text=P1', songCount: 25, dateAdded: Date.now() - 86400000 },
    { id: 'p2', title: 'Morning Coffee', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/33FF57/FFFFFF?text=P2', songCount: 30, dateAdded: Date.now() - 172800000 },
    { id: 'p3', title: 'Road Trip Anthems', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/3357FF/FFFFFF?text=P3', songCount: 45, dateAdded: Date.now() - 259200000 },
    { id: 'p4', title: 'Indie Favorites', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/FFFF33/000000?text=P4', songCount: 20, dateAdded: Date.now() - 345600000 },
    { id: 'p5', title: 'Classical Focus', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/FF33FF/FFFFFF?text=P5', songCount: 15, dateAdded: Date.now() - 432000000 },
    { id: 'p6', title: 'Jazz Lounge', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/33FFFF/000000?text=P6', songCount: 35, dateAdded: Date.now() - 518400000 },
    { id: 'p7', title: 'Workout Mix', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/FF8C00/FFFFFF?text=P7', songCount: 50, dateAdded: Date.now() - 604800000 },
    { id: 'p8', title: 'Chill Vibes', artist: 'Various Artists', cover: 'https://via.placeholder.com/200/8B00FF/FFFFFF?text=P8', songCount: 28, dateAdded: Date.now() - 691200000 },
  ];

  const displayLibrary = library.length > 0 ? sortedLibrary : dummyLibrary;

  return (
    <div className="library-view-container">
      {/* Navigation Bar */}
      <nav className="library-navbar">
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
      <div className="library-content">
        {/* Header Section */}
        <section className="library-header">
          <div className="header-content">
            <h1 className="library-title">Your Library</h1>
            <p className="library-subtitle">
              {displayLibrary.length} {displayLibrary.length === 1 ? 'playlist' : 'playlists'}
            </p>
          </div>
          <button className="btn-primary btn-large" onClick={handleAddPlaylist}>
            + Add Playlist
          </button>
        </section>

        {/* Search and Filter Section */}
        <section className="library-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="sort-container">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'artist')}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="date">Date Added</option>
              <option value="artist">Artist</option>
            </select>
          </div>
        </section>

        {/* Playlists Grid */}
        <section className="playlists-section">
          {displayLibrary.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h2 className="empty-title">No playlists found</h2>
              <p className="empty-text">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Your library is empty. Add playlists from Spotify to get started!'}
              </p>
              {!searchQuery && (
                <button className="btn-primary" onClick={handleAddPlaylist}>
                  Add Your First Playlist
                </button>
              )}
            </div>
          ) : (
            <div className="playlists-grid">
              {displayLibrary.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <Link
                    to={`/playlist/${playlist.id}`}
                    className="playlist-link"
                    onClick={() => handleViewPlaylist(playlist.id)}
                  >
                    <div className="playlist-cover-container">
                      {playlist.cover ? (
                        <img src={playlist.cover} alt={playlist.title} className="playlist-cover" />
                      ) : (
                        <div className="playlist-placeholder">🎵</div>
                      )}
                      <div className="playlist-overlay">
                        <span className="play-button">▶</span>
                      </div>
                    </div>
                    <div className="playlist-info">
                      <h3 className="playlist-title">{playlist.title || 'Untitled Playlist'}</h3>
                      <p className="playlist-artist">{playlist.artist || 'Various Artists'}</p>
                      <p className="playlist-meta">
                        {playlist.songCount || 0} {playlist.songCount === 1 ? 'song' : 'songs'}
                      </p>
                    </div>
                  </Link>
                  <div className="playlist-actions">
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      title="Delete playlist"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default LibraryView;
