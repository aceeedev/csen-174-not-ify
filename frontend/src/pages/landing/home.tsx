import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, authProvider } from '../../firebase';
import './home.css';
import Navbar from '../../components/Navbar';

function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, authProvider);
      // User will stay on home page after login
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar></Navbar>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Share Music, Build Communities</h1>
          <p className="hero-subtitle">
            Create groups, share Spotify playlists, and discover new music with friends.
            All in one place.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/test" className="btn-primary btn-large">
                Go to Test Page
              </Link>
            ) : (
              <button onClick={handleSignIn} className="btn-primary btn-large">
                Get Started
              </button>
            )}
            <Link to="/auth" className="btn-secondary btn-large">
              Try Auth
            </Link>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-content">
          <h2>Why Choose Not-ify?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Spotify Integration</h3>
              <p>Connect your Spotify account and share your favorite playlists with your groups.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Group Collaboration</h3>
              <p>Create or join music groups and collaborate on playlists together.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Real-time Notifications</h3>
              <p>Get notified when new playlists are added or when someone joins your group.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Easy Management</h3>
              <p>Simple interface to manage your groups, playlists, and members.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Start Sharing Music?</h2>
          <p>Join Not-ify today and start discovering new music with your friends.</p>
          {!user && (
            <button onClick={handleSignIn} className="btn-primary btn-large">
              Sign In with Google
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Not-ify. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/test">Test</Link>
            <Link to="/auth">Auth</Link>
            <Link to="/profile">User Profile</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

