import { useEffect, useState } from 'react';
import './libraryView.css';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { Playlist } from '../../models';
import Navbar, { BackButtonLocation } from '../../components/Navbar';
import { getLibraryPlaylistsOnBackend } from '../../backendInterface';
import PlaylistCard from '../../components/PlaylistCard';

function LibraryView() {
  const [userReady, setUserReady] = useState(false);

  const[playlists, setPlaylists] = useState<Playlist[]>([]);

  // could consider making this a more generic function since I think we need it a lot
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
        setPlaylists(await getLibraryPlaylistsOnBackend() ?? []);
      };
      
      fetchData();
    }, [userReady]);

  return (
    <div className="library-view-container">
      <Navbar/>
      
      <div className="library-content">
        <h2 className="title-section">Library</h2>

        {playlists.length === 0 && (
          <p style={{ textAlign: 'center' }}>You have not taken any playlists, first you need to be in a group!</p>
        )}

        <div className="playlist-board-grid">
          {playlists.map((playlist, index) => (
              <PlaylistCard key={index} playlist={playlist} />
          ))}
        </div>
      </div>
    </div>
  )
}
 
export default LibraryView;
