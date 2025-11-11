import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth, getCurrentUserFromFirebase } from '../../firebase';
import { getSpotifyAuthURL } from '../../backendInterface';


function OnboardingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // if the user already has the Spotify access token, return to the main page
      if (currentUser) {
        const user = await getCurrentUserFromFirebase();

        if (user !== null && user.access_token) {
          navigate("/");
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
