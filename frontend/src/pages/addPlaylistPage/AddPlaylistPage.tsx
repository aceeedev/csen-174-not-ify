import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUsersPlaylistsOnBackend } from '../../backendInterface';
import type { Group, SpotifyPlaylist } from '../../models'
import SpotifyPlaylistItem from '../../components/SpotifyPlaylistItem';
import Navbar from '../../components/Navbar';

/**
 * Use like so:
 * 
 *  <Link to="/add-playlist" state={{ group, groupID: "NE20rYPTEZWWywd6V2Xi" }}>
        Add Playlist
    </Link>
 * 
 */

const AddPlaylistPage: React.FC= () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const group = location.state?.group as Group | undefined;
  const groupID = location.state?.groupID as string | undefined;

  const [userReady, setUserReady] = useState<boolean>(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  if (!group || !groupID) {
    return (
      <div>
        <h1>No group selected</h1>

        <p>Please select a group first.</p>

        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserReady(true);
      }
    });
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // fetch data once user has logged in
    if (!userReady) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const playlists = await getUsersPlaylistsOnBackend();
        if (playlists) {
          setSpotifyPlaylists(playlists);
        } else {
          setError("Failed to fetch playlists. Please make sure you're connected to Spotify.");
        }
      } catch (err: any) {
        console.error("Error fetching Spotify playlists:", err);
        const errorMessage = err?.message || err?.toString() || "An error occurred while fetching your playlists. Please try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userReady]);


  return (
    <div>
      <Navbar />
      
      {uploading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Uploading playlist...</h2>
            <div>Please wait</div>
          </div>
        </div>
      )}

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '8px 16px',
              marginBottom: '1rem',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f5f5f5',
              fontSize: '14px'
            }}
          >
        ← Go Back
          </button>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Add a playlist to {group.group_name}!</h1>
          <p style={{ color: '#666', margin: 0 }}>Select one of your Spotify playlists to add to this group</p>
        </div>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⏳</div>
            <h2>Loading your playlists...</h2>
            <p style={{ color: '#666' }}>Please wait</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: '#fee',
            borderRadius: '8px',
            border: '1px solid #fcc'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
            <h2>Error loading playlists</h2>
            <p style={{ color: '#c00', marginBottom: '1rem' }}>{error}</p>
            {error.toLowerCase().includes('refresh token') || error.toLowerCase().includes('reconnect') ? (
              <div>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                  Your Spotify connection has expired. Please reconnect your Spotify account.
                </p>
                <button 
                  onClick={() => navigate('/onboarding?reconnect=true')} 
                  style={{
                    marginTop: '0.5rem',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#1db954',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  Reconnect Spotify
                </button>
              </div>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  marginTop: '1rem',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5'
                }}
              >
                Retry
              </button>
            )}
          </div>
        ) : spotifyPlaylists.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎵</div>
            <h2>No Spotify playlists found</h2>
            <p style={{ color: '#666' }}>Make sure you have playlists in your Spotify account and that you've connected your Spotify account.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: '1rem' }}>Your Spotify Playlists ({spotifyPlaylists.length})</h2>
            <div>
              {spotifyPlaylists.map((playlist, index) => (
                <SpotifyPlaylistItem 
                  key={playlist.spotify_id || index} 
                  groupID={groupID!} 
                  spotifyPlaylist={playlist}
                  setUploading={setUploading}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddPlaylistPage;
