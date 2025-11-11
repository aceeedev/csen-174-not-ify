import { useEffect, useState } from 'react';
import './userHomePage.css';
import { getGroupsOnBackend } from '../../backendInterface';
import type { Group } from '../../models';
import Navbar from '../../components/Navbar';
import GroupCard from '../../components/GroupCard';

function UserHomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  // TODO: library
  const [library, setLibrary] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setGroups(await getGroupsOnBackend() ?? []);
    };
    
    fetchData();
  }, []);

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

    </div>
  );
}

export default UserHomePage;
