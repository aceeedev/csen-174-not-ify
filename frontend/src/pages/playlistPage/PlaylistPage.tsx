import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import type { Group, Playlist, Song } from '../../models'
import Navbar from "../../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { getPlaylistItemsOnBackend, takePlaylistFromGroupOnBackend } from "../../backendInterface"
import SongItem from "../../components/SongItem";


// basically an enum
const PageOrigin = {
    FromLibrary: 'FromLibrary',
    FromGroup: 'FromGroup',
} as const;

const PlaylistPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    
    const playlist = location.state?.playlist as Playlist | undefined;
    const playlistID = location.state?.playlist as string | undefined;
    const group = location.state?.group as Group | undefined;
    const groupID = location.state?.groupID as string | undefined;

    const pageOrigin = (group && groupID) ? PageOrigin.FromGroup : PageOrigin.FromLibrary;

    const [loading, setLoading] = useState<boolean>(true);
    const [userCoins, setCoins] = useState<number | null>(null);
    const [playlistItems, setPlaylistItems] = useState<Song[]>([]);
    const [playlistItemsBlurIndex, setPlaylistItemsBlurIndex] = useState<number>(0);
    

    if (!playlist || !playlistID) {
        return (
        <div>
            <h1>Unknown playlist</h1>

            <button onClick={() => navigate('/')}>Go Home</button>
        </div>
        );
    }


    const fetchData = async () => {
        const songs: Song[] = await getPlaylistItemsOnBackend(playlistID!) ?? []

        setPlaylistItems(songs);

        if (songs.length <= 3) {
            if (songs.length > 1) {
                setPlaylistItemsBlurIndex(1);
            } else {
                setPlaylistItemsBlurIndex(0);
            }
        } else {
            setPlaylistItemsBlurIndex(2);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setCoins(group?.group_member_data[currentUser.uid].coins ?? null)

                fetchData()

                setLoading(false);
            } else {
                setLoading(true);
            }
        });
        
        // cleanup subscription on unmount
        return () => unsubscribe();
    }, []);


    const handleTakePlaylist = async () => {
        await takePlaylistFromGroupOnBackend(groupID!, playlistID)
    }

    const handleExportPlaylist = async () => {
        
    }

    return (
        <div>
            <Navbar/>

            {loading && (
                <p>Loading...</p>
            )}

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
                   
                    <button onClick={handleTakePlaylist}>
                        Take Playlist (costs 1 coin)
                    </button>
                </div>
            )}

            {pageOrigin === PageOrigin.FromLibrary && (
                <div>
                    <button onClick={handleExportPlaylist}>
                        Export Playlist to your Spotify Library
                    </button>
                </div>
            )}

            <h2>Playlist Items</h2>

            {playlistItems.map((song, index) => 
                <SongItem key={index} song={song} isBlurred={index >= playlistItemsBlurIndex}/>
            )}

        </div>
        );
};

export default PlaylistPage;
