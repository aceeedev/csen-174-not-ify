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
    <>
      <Navbar/>
      
      <h1>Library</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', gap: '1rem' }}>
        {playlists.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} />
        ))}
      </div>
    </>
  )
}
 
export default LibraryView;
