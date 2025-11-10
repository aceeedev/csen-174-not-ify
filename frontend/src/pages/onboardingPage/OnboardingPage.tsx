
function OnboardingPage() {
  const signInToSpotify = async () => {
      const res = await fetch("http://localhost:5000/spotify/auth-url");
      const data = await res.json();
      
      window.location.href = data.auth_url;
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
