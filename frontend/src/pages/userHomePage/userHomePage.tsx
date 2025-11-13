import { useEffect, useState } from 'react';
import './userHomePage.css';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getGroupsOnBackend, getLibraryPlaylistsOnBackend } from '../../backendInterface';
import type { Group, Playlist } from '../../models';
import Navbar from '../../components/Navbar';
import GroupCard from '../../components/GroupCard';
import PlaylistCard from '../../components/PlaylistCard';

function UserHomePage() {
  const [userReady, setUserReady] = useState(false);

  const [groups, setGroups] = useState<Group[]>([]);
  const [library, setLibrary] = useState<Playlist[]>([]);

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
      setGroups(await getGroupsOnBackend() ?? []);
      setLibrary(await getLibraryPlaylistsOnBackend() ?? []);
    };
    
    fetchData();
  }, [userReady]);

  return (
    <div>
      <Navbar></Navbar>

      <h1>Groups</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', gap: '1rem' }}>
        {groups.map((group, index) => (
            <GroupCard key={index} group={group} />
        ))}
      </div>
      
      <h1>Library</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', gap: '1rem' }}>
        {library.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist} playlistID="fCTuK1b6SynKmDa1VSvN" />
        ))}
      </div>

    </div>
  );
}

export default UserHomePage;
