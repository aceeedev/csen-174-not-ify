import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import type { Group, Playlist } from '../../models'
import Navbar from "../../components/Navbar";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, getCurrentUserFromFirebase } from "../../firebase";


// basically an enum
const PageOrigin = {
    FromLibrary: 'FromLibrary',
    FromGroup: 'FromGroup',
} as const;

type PageOriginType = typeof PageOrigin[keyof typeof PageOrigin];


const PlaylistPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const playlist = location.state?.playlist as Playlist | undefined;
    const group = location.state?.group as Group | undefined;
    const groupID = location.state?.groupID as string | undefined;

    const pageOrigin = (group && groupID) ? PageOrigin.FromGroup : PageOrigin.FromLibrary;

    const [userCoins, setCoins] = useState<number | null>(null);
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            setCoins(group?.group_member_data[currentUser.uid].coins ?? null)
          }
        });
        
        // cleanup subscription on unmount
        return () => unsubscribe();
    }, []);


    if (!playlist) {
        return (
        <div>
            <h1>Unknown playlist</h1>

            <button onClick={() => navigate('/')}>Go Home</button>
        </div>
        );
    }
    

    return (
        <div>
            <Navbar/>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
                <img 
                    src={playlist.cover} 
                    alt={playlist.title}
                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <h1>{playlist.title}</h1>
            </div>
            
            <p>{playlist.description}</p>

            <h2>Actions</h2>

            {pageOrigin === PageOrigin.FromGroup && (
                <div>
                    <p>You have {userCoins} coins.</p>
                   
                    <button>Take Playlist (costs 1 coin)</button>
                </div>
            )}

            {pageOrigin === PageOrigin.FromLibrary && (
                <div>
                    <button>Export Playlist to your Spotify Library</button>
                </div>
            )}

            <h2>Playlist Items</h2>

        </div>
        );
};

export default PlaylistPage;
