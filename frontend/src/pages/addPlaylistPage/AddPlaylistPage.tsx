import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUsersPlaylistsOnBackend } from '../../backendInterface';
import type { Group, SpotifyPlaylist } from '../../models'
import SpotifyPlaylistItem from '../../components/SpotifyPlaylistItem';


const AddPlaylistPage: React.FC= () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const group = location.state?.group as Group | undefined;

  const [userReady, setUserReady] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>([]);


  if (!group) {
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
        <h1>Add a playlist to {group.group_name}!</h1>

        <h2>Your Spotify Playlists</h2>
        <div>
            {spotifyPlaylists.map((playlist, index) => (
                <SpotifyPlaylistItem key={index} spotifyPlaylist={playlist} />
            ))}
        </div>
    </div>
  );
}

export default AddPlaylistPage;
