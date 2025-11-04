import React, { useState } from 'react';
import { auth, authProvider } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, type UserCredential } from "firebase/auth";

const TestAuthPage: React.FC = () => {
  const [user, setUser] = useState<UserCredential | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

    const signInToGoogle = async () => {
        setLoading(true);

        signInWithPopup(auth, authProvider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        setUser(result);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
    
    setLoading(false);
    }

    const signInToSpotify = async () => {
      const res = await fetch("http://localhost:5000/spotify/auth-url");
      const data = await res.json();
      
      window.location.href = data.auth_url;
    };

  return (
    <div>
      <button onClick={signInToGoogle} disabled={loading}>
        {loading ? 'Authenticating...' : 'Login with Google'}
      </button>
      {user && (
        <div>
          {user.user.displayName}
        </div>
      )}

      <button onClick={signInToSpotify} disabled={loading}>Login with Spotify</button>
    </div>
  );
};

export default TestAuthPage;
