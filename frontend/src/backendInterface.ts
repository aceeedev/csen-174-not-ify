import { sendRequestWithIdToken } from "./firebase"
import type { Group, Playlist, SpotifyPlaylist, Song, firebaseUser} from "./models";


const baseURL: string = import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:5001";

interface BackendSuccess<T> {
    success: true;
    data: T;
}

interface BackendError {
    success: false;
    response: Response;
    message: string;
}

type BackendResponse<T> = BackendSuccess<T> | BackendError;


async function fetchBackend<T>(
  urlPath: string,
  queryParameters?: Record<string, string>,
): Promise<BackendResponse<T>> {
  try {
    let url = `${baseURL}${urlPath}`;
    if (queryParameters) {
      const params = new URLSearchParams(queryParameters);
      url += `?${params.toString()}`;
    }

    const res = await sendRequestWithIdToken(url, null, "GET");
    
    if (!res) {
      return {
        success: false,
        response: null as any,
        message: "Network error: No response received. Please check if you're signed in and the backend is running.",
      };
    }

    let data: any;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      return {
        success: false,
        response: res,
        message: `Failed to parse response: ${res.status} ${res.statusText}`,
      };
    }

    if (res.status === 200) {
      return {
        success: true,
        data: data.data || data,
      };
    } else if (res.status === 400) {
      return {
        success: false,
        response: res,
        message: data.error || "Bad request",
      };
    } else if (res.status === 500) {
      return {
        success: false,
        response: res,
        message: data.error || "Server error: " + (data.message || "Internal server error"),
      };
    } else {
      return {
        success: false,
        response: res,
        message: data.error || data.message || `Request failed with status ${res.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      response: null as any,
      message: `Exception: ${error}`,
    };
  }
}

export async function getSpotifyAuthURL(): Promise<string> {
    try {
        console.log(`Attempting to fetch Spotify auth URL from: ${baseURL}/spotify/auth-url`);
        const res = await fetch(`${baseURL}/spotify/auth-url`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error(`Backend error response: ${errorText}`);
            throw new Error(`Backend returned status ${res.status}: ${res.statusText}. ${errorText}`);
        }
        
        const data = await res.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (!data['auth_url']) {
            throw new Error("Backend did not return an auth_url");
        }

        return data['auth_url'];
    } catch (error) {
        if (error instanceof TypeError) {
            const errorMsg = error.message;
            if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError') || errorMsg.includes('fetch')) {
                throw new Error(`Cannot connect to backend at ${baseURL}. Please make sure:\n1. The backend server is running\n2. The backend URL is correct\n3. There are no firewall issues blocking the connection`);
            }
        }
        throw error;
    }
}

export async function sendSpotifyAuthCallback(code: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/spotify/auth-callback", { code });
}

export async function getGroupsOnBackend(): Promise<Group[] | null> {
    const result = await fetchBackend<Group[]>("/get/groups");
    
    return result.success ? result.data : null;
}

export async function createGroupOnBackend(groupName: string, description: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/create/group", {
        groupName: groupName,
        description: description,
    });
}

export async function joinGroupOnBackend(groupID: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/join/group", {
            group_id: groupID
        });
}

export async function editGroupOnBackend(groupID: string, action: "remove_user" | "del_group", params: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/edit/group", {
            groupID: groupID,
            action: action,
            params: params,
        });
}

// This is the User's spotify playlists, NOT firebase playlists
export async function getUsersPlaylistsOnBackend(): Promise<SpotifyPlaylist[] | null> {
    const result = await fetchBackend<SpotifyPlaylist[]>("/get/users/playlists");

    if (!result.success) {
        console.error("Failed to fetch Spotify playlists:", result.message);
        throw new Error(result.message || "Failed to fetch playlists");
    }

    return result.data;
}

// this is the User's firebase playlists, NOT spotify playlists
export async function getLibraryPlaylistsOnBackend(): Promise<Playlist[] | null> {
    const result = await fetchBackend<Playlist[]>("/get/playlist/library");
    
    return result.success ? result.data : null;
}

export async function getGroupPlaylistsOnBackend(groupID: string): Promise<Playlist[] | null> {
    const result = await fetchBackend<Playlist[]>("/get/playlist/group", {
            group_id: groupID
        });
    
    return result.success ? result.data : null;
}

export async function addPlaylistToGroupOnBackend(groupID: string, spotifyPlaylistID: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/add/playlist/group", {
            group_id: groupID,
            spotify_playlist_id: spotifyPlaylistID
        });
}

export async function takePlaylistFromGroupOnBackend(groupID: string, playlistID: string): Promise<BackendResponse<void>> {
    return fetchBackend<void>("/take/playlist/group", {
            groupID: groupID,
            playlistID: playlistID
        });
}

export async function getPlaylistItemsOnBackend(playlistID: string): Promise<Song[] | null> {
    const result = await fetchBackend<Song[]>("/get/playlist/items", {
      playlistID: playlistID
    });
    
    return result.success ? result.data : null;
}

export async function exportPlaylist(playlistID: string) {
  const res = await fetchBackend<void>("/export/playlist", {
    playlistID: playlistID
  });
  return res.success

}

export async function inviteToGroupOnBackend(groupID: string, userID: string) {
  return await fetchBackend<void>("/invite/group", {
    groupID: groupID,
    userID: userID
  })
}

export async function getGroupMembersListOnBackend(group_id: string): Promise<firebaseUser[] | null> {
    const result = await fetchBackend<firebaseUser[]>("/get/group/members/list", {
      group_id: group_id
    });
    
    return result.success ? result.data : null;
}