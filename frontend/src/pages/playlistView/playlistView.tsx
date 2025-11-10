/*THIS IS THE PAGE WHERE THE USER CAN VIEW ANY SELECTED PLAYLIST */

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './playlistView.css';

function PlaylistView() {
  const { playlistId } = useParams();
  
  // TODO: Fetch playlist data from backend
  const [playlist, setPlaylist] = useState<any>(null);
  
  // TODO: Fetch songs from backend
  const [songs, setSongs] = useState<any[]>([]);

  const handlePlayPlaylist = () => {
    // TODO: Implement play playlist functionality (Spotify integration)
  };

  const handleRemoveSong = (songId: string) => {
    // TODO: Implement remove song functionality
  };

  const handleAddToQueue = (songId: string) => {
    // TODO: Implement add to queue functionality
  };

  const handleSharePlaylist = () => {
    // TODO: Implement share playlist functionality
  };

  // Dummy data for demonstration
  const dummyPlaylist = {
    id: playlistId,
    title: 'My Discoveries',
    artist: 'Various Artists',
    cover: 'https://via.placeholder.com/300/FF5733/FFFFFF?text=P1',
    description: 'A collection of my favorite discoveries',
    songCount: 25,
    duration: '1h 23m',
    owner: 'You',
    dateCreated: Date.now() - 86400000,
  };

  const dummySongs = [
    { id: 's1', title: 'Song Title 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45', cover: 'https://via.placeholder.com/50/FF5733/FFFFFF?text=S1' },
    { id: 's2', title: 'Song Title 2', artist: 'Artist 2', album: 'Album 2', duration: '4:12', cover: 'https://via.placeholder.com/50/33FF57/FFFFFF?text=S2' },
    { id: 's3', title: 'Song Title 3', artist: 'Artist 3', album: 'Album 3', duration: '3:28', cover: 'https://via.placeholder.com/50/3357FF/FFFFFF?text=S3' },
    { id: 's4', title: 'Song Title 4', artist: 'Artist 4', album: 'Album 4', duration: '5:01', cover: 'https://via.placeholder.com/50/FFFF33/000000?text=S4' },
    { id: 's5', title: 'Song Title 5', artist: 'Artist 5', album: 'Album 5', duration: '2:59', cover: 'https://via.placeholder.com/50/FF33FF/FFFFFF?text=S5' },
  ];

  const displayPlaylist = playlist || dummyPlaylist;
  const displaySongs = songs.length > 0 ? songs : dummySongs;

  return (
    <div className="playlist-view-container">
      {/* Navigation Bar */}
      <nav className="playlist-navbar">
        <div className="nav-content">
          <Link to="/library" className="logo-link">
            <h1 className="logo">Not-ify</h1>
          </Link>
          <div className="nav-links">
            <Link to="/library" className="btn-secondary">Back to Library</Link>
          </div>
        </div>
      </nav>

      {/* Playlist Header */}
      <section className="playlist-header">
        <div className="header-content">
          <div className="playlist-cover-large">
            {displayPlaylist.cover ? (
              <img src={displayPlaylist.cover} alt={displayPlaylist.title} />
            ) : (
              <div className="playlist-placeholder-large">🎵</div>
            )}
          </div>
          <div className="playlist-details">
            <p className="playlist-type">Playlist</p>
            <h1 className="playlist-title-large">{displayPlaylist.title || 'Untitled Playlist'}</h1>
            <p className="playlist-description">{displayPlaylist.description || 'No description'}</p>
            <div className="playlist-meta-info">
              <span className="playlist-owner">{displayPlaylist.owner || 'Unknown'}</span>
              <span className="meta-separator">•</span>
              <span className="playlist-song-count">
                {displayPlaylist.songCount || 0} {displayPlaylist.songCount === 1 ? 'song' : 'songs'}
              </span>
              <span className="meta-separator">•</span>
              <span className="playlist-duration">{displayPlaylist.duration || '0m'}</span>
            </div>
            <div className="playlist-actions-header">
              <button className="btn-primary btn-play" onClick={handlePlayPlaylist}>
                ▶ Play
              </button>
              <button className="btn-secondary btn-share" onClick={handleSharePlaylist}>
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Songs List */}
      <section className="songs-section">
        <div className="songs-header">
          <h2 className="songs-title">Songs</h2>
          <div className="songs-count">{displaySongs.length} tracks</div>
        </div>
        {displaySongs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎵</div>
            <h3 className="empty-title">No songs in this playlist</h3>
            <p className="empty-text">Add songs from Spotify to get started!</p>
          </div>
        ) : (
          <div className="songs-list">
            {displaySongs.map((song, index) => (
              <div key={song.id} className="song-item">
                <div className="song-index">{index + 1}</div>
                <div className="song-cover">
                  {song.cover ? (
                    <img src={song.cover} alt={song.title} />
                  ) : (
                    <div className="song-placeholder">🎵</div>
                  )}
                </div>
                <div className="song-info">
                  <h4 className="song-title">{song.title || 'Untitled'}</h4>
                  <p className="song-artist">{song.artist || 'Unknown Artist'}</p>
                </div>
                <div className="song-album">{song.album || 'Unknown Album'}</div>
                <div className="song-duration">{song.duration || '0:00'}</div>
                <div className="song-actions">
                  <button
                    className="btn-action btn-add-queue"
                    onClick={() => handleAddToQueue(song.id)}
                    title="Add to queue"
                  >
                    +
                  </button>
                  <button
                    className="btn-action btn-remove"
                    onClick={() => handleRemoveSong(song.id)}
                    title="Remove song"
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
  );
}

export default PlaylistView;
