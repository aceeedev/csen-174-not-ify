import React, { useState, useEffect } from 'react';
import { auth, authProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);


  const checkSpotifyAccessToken = async (user: User) => {
    // check if the document with the id user.uid in the Firestore collection named Users has the attribute access_token
    
    const userId = user.uid;
    const userDocRef = doc(db, "Users", userId);
    
    try {
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        
        if (!userData.access_token) {
          // the user document does not have Spotify access_token info -> need to onboard
          navigate("/onboarding");
        }
      } else {
        // the user document does not exist in Firestore -> need to onboard
        navigate("/onboarding");
      }
    } catch (error) {
      console.error("Error checking Firestore document:", error);
    }
  };

  // listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        checkSpotifyAccessToken(currentUser);
      }
    });
    
    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInToGoogle = async () => {
    setLoading(true);

    signInWithPopup(auth, authProvider).then(async (result) => {
      checkSpotifyAccessToken(result.user);
    }).catch((error) => {
      console.log("Google sign in error", error);
    });
  
    setLoading(false);
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
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
                Hello, {user.displayName || user.email}
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
