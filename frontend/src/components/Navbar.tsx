import React, { useState, useEffect } from 'react';
import { auth, authProvider, getCurrentUserFromFirebase } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import type { User } from "../models"

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const checkSpotifyAccessToken = async () => {
    // check if the document with the id user.uid in the Firestore collection named Users has the attribute access_token
    const user = await getCurrentUserFromFirebase();

    if (user !== null && !user.access_token) {
      navigate("/onboarding");
    } else if (user === null) {
      navigate("/onboarding");
    }

  };

  // listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(await getCurrentUserFromFirebase());

        checkSpotifyAccessToken();
      }
    });
    
    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInToGoogle = async () => {
    setLoading(true);

    signInWithPopup(auth, authProvider).then(async (result) => {
      checkSpotifyAccessToken();
    }).catch((error) => {
      console.log("Google sign in error", error);
    });
  
    setLoading(false);
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  
  return (
     <div>
      <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'black'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <div style={{fontWeight: 700, fontSize: 20}}>Not-ify</div>
          <nav style={{display: 'flex', gap: 12}}>
            <Link to={"/TODO"} style={{cursor: 'pointer'}}>
                Groups
            </Link>
            <Link to={"/TODO"} style={{cursor: 'pointer'}}>
                Library
            </Link>
          </nav>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          {user ? (
            <>
              <span style={{color: 'white', fontSize: 14}}>
                Hello, {user.name}
              </span>
              <button onClick={handleSignOut} style={{padding: '8px 12px'}}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={signInToGoogle} disabled={loading} style={{padding: '8px 12px'}}>
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
