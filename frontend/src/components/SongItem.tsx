import React from 'react';
import type { Song } from '../models';


export interface SongItemProps {
    song: Song;
    isBlurred: boolean;
}

const SongItem: React.FC<SongItemProps> = ({ song, isBlurred }) => {    
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
            marginRight: 'auto',
            filter: isBlurred ? 'blur(5px)' : 'none',
            pointerEvents: isBlurred ? 'none' : 'auto',
            userSelect: isBlurred ? 'none' : 'auto'
        }}>
            <img
                src={song.album_cover} 
                style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                }}
            />

            <div 
                style={{ 
                    flex: 1,
                    fontStyle: 'bold',
                    }}>
                {song.title}
            </div>

            <div 
                style={{ 
                    flex: 1,
                    fontStyle: 'italic',
                }}>
                {song.artist_name}
            </div>

            <div 
                style={{ 
                    flex: 1,
                    fontStyle: 'italic',
                    color: 'grey'
                    }}>
                {'['}{song.album_name}{']'}
            </div>

        </div>
    );
};

export default SongItem;
