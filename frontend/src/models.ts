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
    owner_id: string;
    member_ids: string[];
    description: string;
    group_name: string;
    group_member_data: Record<string, GroupMemberData>; // maps user_id -> GroupMemberData
    maxPLists?: number;
    maxMembers?: number;
}


export interface Playlist {
    spotify_id: string;
    owner_id: string;
    title: string;
    cover: string;
    description: string;
    songs: string[];
}


export interface Song {
    spotify_id: string;
    album_cover: string;
    album_name: string;
    artist_name: string;
    title: string;
}

export interface User {
    name: string;
    spotify_id: string;
    access_token: string;
    profile_pic: string;
    library: string[];
    my_groups: string[];
    my_complaints: string[];
    is_admin: boolean;
}
