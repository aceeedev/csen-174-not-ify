import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Playlist } from '../models';

interface PlaylistCardProps {
    playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/playlist', { 
            state: { 
                playlist: playlist,
                // No groupID means it's from library
            } 
        });
    };

    return (
        <div 
            className="playlist-card" 
            onClick={handleClick}
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                margin: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                transition: 'box-shadow 0.3s ease',
                cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
        >
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{playlist.title}</h3>
            <p style={{ margin: '0', color: '#666' }}>{playlist.description}</p>
        </div>
    );
};

export default PlaylistCard;