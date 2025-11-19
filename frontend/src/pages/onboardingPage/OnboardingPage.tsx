import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth, getCurrentUserFromFirebase } from '../../firebase';
import { getSpotifyAuthURL } from '../../backendInterface';


function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forceReconnect = searchParams.get('reconnect') === 'true';
  const [spotifyAuthURL, setSpotifyAuthURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If force reconnect is true, skip the redirect check
    if (forceReconnect) {
      return;
    }

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
  }, [forceReconnect, navigate]);

  const signInToSpotify = async () => {
    setLoading(true);
    try {
      console.log("Fetching Spotify auth URL...");
      const authURL = await getSpotifyAuthURL();
      
      console.log("Received auth URL:", authURL);
      
      if (!authURL) {
        alert("Failed to get Spotify authorization URL. Please make sure the backend is running.");
        setLoading(false);
        return;
      }
      
      if (!authURL.startsWith('http://') && !authURL.startsWith('https://')) {
        alert(`Invalid auth URL received: ${authURL}. Please check backend configuration.`);
        setLoading(false);
        return;
      }
      
      // Validate URL before redirect
      try {
        new URL(authURL); // This will throw if URL is invalid
      } catch (urlError) {
        console.error("Invalid URL format:", urlError);
        alert(`Invalid Spotify authorization URL format. Please check backend configuration.`);
        setLoading(false);
        return;
      }
      
      // Store the URL and show the link
      setSpotifyAuthURL(authURL);
      setLoading(false);
      
      console.log("Spotify auth URL ready:", authURL);
      console.log("URL length:", authURL.length);
      
      // Try automatic redirect, but don't rely on it - the link will always be available
      // Safari sometimes blocks programmatic redirects, so the link is the fallback
      setTimeout(() => {
        try {
          window.location.href = authURL;
        } catch (redirectError) {
          console.log("Automatic redirect not available, use the link below");
        }
      }, 500);
    } catch (error) {
      console.error("Error getting Spotify auth URL:", error);
      alert(`Failed to connect to Spotify: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend is running at ${import.meta.env.VITE_BACKEND_URL ?? 'http://127.0.0.1:5001'}`);
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Welcome to Bop Swap!</h1>
      {forceReconnect ? (
        <div>
          <p style={{ color: '#c00', marginBottom: '1rem' }}>
            Your Spotify connection needs to be refreshed. Please sign in again.
          </p>
        </div>
      ) : (
        <p>You need to first sign into Spotify so you can share your music.</p>
      )}

      {spotifyAuthURL ? (
        <div>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            If the redirect didn't work, click the link below:
          </p>
          <a 
            href={spotifyAuthURL}
            target="_self"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#1db954',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'none',
              marginTop: '1rem'
            }}
          >
            {forceReconnect ? 'Reconnect to Spotify' : 'Sign in to Spotify'}
          </a>
          <button 
            onClick={() => setSpotifyAuthURL(null)}
            style={{
              display: 'block',
              margin: '1rem auto 0',
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#ccc',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <button 
          onClick={signInToSpotify}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#1db954',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            marginTop: '1rem'
          }}
        >
          {loading ? 'Loading...' : (forceReconnect ? 'Reconnect to Spotify' : 'Sign in to Spotify')}
        </button>
      )}
    </div>
  );
}

export default OnboardingPage;
