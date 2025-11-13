import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUsersPlaylistsOnBackend } from '../../backendInterface';
import type { Group, SpotifyPlaylist } from '../../models'
import SpotifyPlaylistItem from '../../components/SpotifyPlaylistItem';

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
      setSpotifyPlaylists(await getUsersPlaylistsOnBackend() ?? []);
    };
    
    fetchData();
  }, [userReady]);


  return (
    <div>
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
            backgroundColor: 'gray',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>Uploading playlist...</h2>
            <div>Please wait</div>
          </div>
        </div>
      )}

      <h1>Add a playlist to {group.group_name}!</h1>

      <button 
        onClick={() => navigate(-1)}
        style={{
          padding: '8px 16px',
          margin: '1rem',
          cursor: 'pointer',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: 'gray'
        }}
      >
        Go Back
      </button>

      <h2>Your Spotify Playlists</h2>
      <div>
          {spotifyPlaylists.map((playlist, index) => (
              <SpotifyPlaylistItem 
                key={index} 
                groupID={groupID} 
                spotifyPlaylist={playlist}
                setUploading={setUploading}
                />
          ))}
      </div>
    </div>
  );
}

export default AddPlaylistPage;
