// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { type User, type Group, type Playlist, type Song  } from "./models";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGTEiChP6wGK2brVjEz4w61-jPBKkrFxQ",
  authDomain: "csen-174-not-ify.firebaseapp.com",
  projectId: "csen-174-not-ify",
  storageBucket: "csen-174-not-ify.firebasestorage.app",
  messagingSenderId: "50712598431",
  appId: "1:50712598431:web:86149ebd2bdd374102cfaa",
  measurementId: "G-PNYTBP178G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const authProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

/**
 * Gets the current user's Firebase ID token.
 * @param forceRefresh - If true, forces a refresh of the token.
 * @returns The ID token as a string, or null if the user is not logged in.
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser;

  if (!user) {
    console.warn("No user is currently signed in.");
    return null;
  }

  try {
    const token = await user.getIdToken(forceRefresh);
    return token;

  } catch (error) {
    console.error("Error fetching ID token:", error);
    return null;
  }
}

/**
 * Sends the current user's ID token to your backend.
 * @param url - The endpoint to send the token to.
 * @param body - Optional body data to include in the request.
 * @param method - HTTP method (default: POST)
 * @returns The fetch Response object, or null if no user is signed in.
 */
export async function sendRequestWithIdToken(
  url: string,
  body: any = {},
  method: "POST" | "GET" | "PUT" | "DELETE" = "POST"
): Promise<Response | null> {
  const token = await getIdToken();
  if (!token) return null;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    });

    return response;
  } catch (error) {
    console.error("Error sending ID token to backend:", error);
    return null;
  }
}

// Firebase document getters
async function _getDocFromFirebase<T>(collection: string, docID: string): Promise<T | null> {
  const userDocRef = doc(db, collection, docID);

  try {
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();

      return data as T;
    }
  } catch (error) {
    console.error(`Error getting Firestore document, ${docID}, from collection, ${collection}:`, error);
  }

  return null;
}

export async function getUserFromFirebase(userID: string): Promise<User | null> {
  return _getDocFromFirebase<User>("Users", userID);
}

export async function getGroupFromFirebase(groupID: string): Promise<Group | null> {
  return _getDocFromFirebase<Group>("Groups", groupID);
}

export async function getPlaylistFromFirebase(playlistID: string): Promise<Playlist | null> {
  return _getDocFromFirebase<Playlist>("Playlists", playlistID);
}

export async function getSongFromFirebase(songID: string): Promise<Song | null> {
  return _getDocFromFirebase<Song>("Songs", songID);
}


export default app;
