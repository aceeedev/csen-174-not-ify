import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Group, Playlist } from '../models';

import "./playlistCard.css";



interface PlaylistCardProps {
    playlist: Playlist;
    group?: Group | undefined;
    groupID?: string | undefined;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, group = undefined, groupID = undefined }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/playlist', { 
            state: { 
                playlist: playlist,
                group: group,
                groupID: groupID
            } 
        });
    };

    return (
        <div
            className="playlist-card"
            onClick={() => handleClick()}
        >
            <div>
            {playlist.cover ? (
                    <img src={playlist.cover} alt={playlist.title} className="playlist-cover" />
                ) : (
                    <div className="playlist-placeholder">🎵</div>
                )}
            </div>
            <div className="playlist-info">
                <h3 className="playlist-title">{playlist.title || 'Untitled Playlist'}</h3>
                <p className="playlist-owner">
                    by {playlist.owner_name}
                </p>
                <p className="playlist-songs">{playlist.songs?.length || 0} songs</p>
                {playlist.is_owner && !playlist.is_taken && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                    Your playlist
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistCard;