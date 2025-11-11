import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../../firebase';
import { getSpotifyAuthURL } from '../../backendInterface';


function OnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // if the user already has the Spotify access token, return to the main page

      if (currentUser) {
        const userId = currentUser.uid;
        const userDocRef = doc(db, "Users", userId);
            
        try {
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            if (userData.access_token) {
              // the user has an access_token -> redirect to home page
              navigate("/");
            }
          }
        } catch (error) {
          console.error("Error checking Firestore document:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInToSpotify = async () => {
    const authURL = await getSpotifyAuthURL();
    
    window.location.href = authURL;
  };
  
  return (
    <div>
      <h1>Welcome to Not-ify!</h1>
      <p>You need to first sign into Spotify so you can share your music.</p>

      <button onClick={signInToSpotify}>Sign in to Spotify</button>
    </div>
  );
}

export default OnboardingPage;
