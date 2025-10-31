import { useEffect } from "react";
import { useNavigate } from "react-router";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`http://localhost:5000/api/data/auth-callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          navigate("/");
        })
        .catch(err => console.error("Token exchange failed:", err));
    }
  }, [navigate]);

  return <p>Authenticating with Spotify...</p>;
};

export default Callback;
