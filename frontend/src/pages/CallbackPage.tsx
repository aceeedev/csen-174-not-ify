import React, { useEffect, useState } from "react";
import { auth, getIdToken } from "../firebase";
import { useNavigate } from "react-router";

import { sendSpotifyAuthCallback } from "../backendInterface"

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    // Wait until Firebase restores user from local storage
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFirebaseReady(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseReady) return;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (!code) return;

    // Now it's safe to get the ID token
    (async () => {
      const token = await getIdToken();
      if (!token) {
        console.error("User is not signed in after Firebase restored session");
        return;
      }

      const res = await sendSpotifyAuthCallback(code);

      if (res.success) {
        navigate("/")
      } else {
        console.log("Error", res.message);
      }
    })();
  }, [firebaseReady, navigate]);

  return <p>Authenticating with Spotify...</p>;
};

export default Callback;
