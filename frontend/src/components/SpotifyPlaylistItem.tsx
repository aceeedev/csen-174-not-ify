import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SpotifyPlaylist } from '../models';
import { addPlaylistToGroupOnBackend } from '../backendInterface';


export interface SpotifyPlaylistItemProps {
    spotifyPlaylist: SpotifyPlaylist;
    groupID: string;
    setUploading: (loading: boolean) => void;
}

const SpotifyPlaylistItem: React.FC<SpotifyPlaylistItemProps> = ({ spotifyPlaylist, groupID, setUploading }) => {
    const navigate = useNavigate();

    const handleAddPlaylist = async () => {
        setUploading(true);
        
        try {
            const result = await addPlaylistToGroupOnBackend(groupID, spotifyPlaylist.spotify_id);
            
            if (result.success) {
                // navigate back a page
                navigate(-1);
            } else {
                console.error('Failed to add playlist:', result.message);
                alert(`Error: ${result.message}`);

                setUploading(false);
            }
        } catch (error) {
            console.error('Error adding playlist:', error);
            alert('Failed to add playlist');
        }
    };
    
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            width: '50%',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            <img
                src={spotifyPlaylist.cover} 
                style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                }}
            />

            <div style={{ flex: 1 }}>
                {spotifyPlaylist.title}
            </div>

            <button style={{ padding: '8px 16px' }} onClick={handleAddPlaylist}>
                Add to group
            </button>
        </div>
    );
};

export default SpotifyPlaylistItem;