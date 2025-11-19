import React, { useEffect, useState } from "react";
import { auth, getIdToken } from "../firebase";
import { useNavigate } from "react-router";

import { sendSpotifyAuthCallback } from "../backendInterface"

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [status, setStatus] = useState<string>("Authenticating with Spotify...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Firebase restores user from local storage
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseReady(!!user);
      if (!user) {
        setError("You must be signed in to connect Spotify. Redirecting to home...");
        setTimeout(() => navigate("/"), 2000);
      }
    });
    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (!firebaseReady) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");
    
    console.log("Callback page loaded. Code:", code ? "present" : "missing", "Error:", errorParam);
    console.log("Full URL:", window.location.href);
    
    if (errorParam) {
      console.error("Spotify returned an error:", errorParam);
      setError(`Spotify authorization failed: ${errorParam}. Please try again.`);
      setTimeout(() => navigate("/onboarding?reconnect=true"), 3000);
      return;
    }
    
    if (!code) {
      console.warn("No authorization code in URL");
      setError("No authorization code received from Spotify. The redirect may have failed. Please try again.");
      setTimeout(() => navigate("/onboarding?reconnect=true"), 3000);
      return;
    }

    // Now it's safe to get the ID token
    (async () => {
      try {
        setStatus("Getting authentication token...");
        const token = await getIdToken();
        if (!token) {
          setError("You must be signed in to connect Spotify. Redirecting...");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        setStatus("Connecting your Spotify account...");
        console.log("Sending code to backend:", code.substring(0, 20) + "...");
        const res = await sendSpotifyAuthCallback(code);
        console.log("Backend response:", res);

        if (res.success) {
          setStatus("Successfully connected! Redirecting...");
          setTimeout(() => navigate("/userHomePage"), 1500);
        } else {
          console.error("Backend error:", res.message);
          setError(`Failed to connect Spotify: ${res.message}. Please try again.`);
          setTimeout(() => navigate("/onboarding?reconnect=true"), 3000);
        }
      } catch (err) {
        console.error("Error in callback:", err);
        setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setTimeout(() => navigate("/onboarding?reconnect=true"), 3000);
      }
    })();
  }, [firebaseReady, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      {error ? (
        <>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ color: '#c00' }}>Error</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
          <p style={{ color: '#999', fontSize: '14px' }}>Redirecting...</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⏳</div>
          <h2>{status}</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>Please wait...</p>
        </>
      )}
    </div>
  );
};

export default Callback;
