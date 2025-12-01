export interface PostedPlaylist {
    playlist_id: string;
    number_downloaded: number;
}

export interface GroupMemberData {
    coins: number;
    last_posting_timestamp: Date;
    taken_playlists: string[];
    posted_playlists: PostedPlaylist[];
}

export interface Group {
    id?: string;
    owner_id: string;
    member_ids: string[];
    description: string;
    group_name: string;
    group_member_data: Record<string, GroupMemberData>; // maps user_id -> GroupMemberData
    max_playlists?: number;
    max_members?: number;
    invite_code?: string;
}


export interface Playlist {
    id?: string;
    spotify_id: string;
    owner_name?: string;
    owner_id: string;
    title: string;
    cover: string;
    description: string;
    songs: string[];
    can_take: boolean | undefined;
    is_owner: boolean | undefined;
    is_taken: boolean | undefined;
}


export interface Song {
    spotify_id: string;
    album_cover: string;
    album_name: string;
    artist_name: string;
    title: string;
}

export interface firebaseUser {
    id?: string;
    name: string;
    spotify_id: string;
    access_token: string;
    profile_pic: string;
    library: string[];
    my_groups: string[];
    my_complaints: string[];
    is_admin: boolean;
    exported_playlists: string[];
}

export interface SpotifyPlaylist {
    cover: string;
    spotify_id: string;
    title: string
}