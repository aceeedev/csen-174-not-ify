import { sendRequestWithIdToken } from "./firebase"
import type { Group, Playlist, SpotifyPlaylist } from "./models";


const baseURL: string = "http://localhost:5001";

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
        message: "Network error: No response received",
      };
    }

    const data = await res.json();

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
    } else {
      return {
        success: false,
        response: res,
        message: data.error || `Request failed with status ${res.status}`,
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
    const res = await fetch(`${baseURL}/spotify/auth-url`);
    const data = await res.json();

    return data['auth_url'];
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
