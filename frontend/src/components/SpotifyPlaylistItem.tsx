import React from 'react';
import type { SpotifyPlaylist } from '../models';


export interface SpotifyPlaylistItemProps {
    spotifyPlaylist: SpotifyPlaylist;
}

const SpotifyPlaylistItem: React.FC<SpotifyPlaylistItemProps> = ({ spotifyPlaylist }) => {
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

            <button style={{ padding: '8px 16px' }}>
                Add to group
            </button>
        </div>
    );
};

export default SpotifyPlaylistItem;