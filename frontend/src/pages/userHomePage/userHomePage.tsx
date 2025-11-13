import { useEffect, useState } from 'react';
import './userHomePage.css';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getGroupsOnBackend, getLibraryPlaylistsOnBackend } from '../../backendInterface';
import type { Group, Playlist } from '../../models';
import Navbar from '../../components/Navbar';
import GroupCard from '../../components/GroupCard';
import PlaylistCard from '../../components/PlaylistCard';
import { Link } from 'react-router-dom';

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
          <div>
            <GroupCard key={index} group={group} />

            <Link to="/playlist" state={{ playlist: library[0], group, groupID: "NE20rYPTEZWWywd6V2Xi" }}>
                Playlist from group test
            </Link>
          </div>
        ))}
      </div>
      
      <h1>Library</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', overflowX: 'auto', gap: '1rem' }}>
        {library.map((playlist, index) => (
            <PlaylistCard key={index} playlist={playlist}/>
        ))}
      </div>

    </div>
  );
}

export default UserHomePage;
