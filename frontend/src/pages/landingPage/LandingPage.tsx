import { signInWithPopup } from "firebase/auth";
import Navbar from "../../components/Navbar"
import './LandingPage.css';
import { Link } from "react-router-dom";
import { auth, authProvider } from "../../firebase";



function LandingPage() {

  const signInToGoogle = async () => {  
    signInWithPopup(auth, authProvider).then(async (result) => {
      // checkSpotifyAccessToken();
    }).catch((error) => {
      console.log("Google sign in error", error);
    });
  }

  return (
    <>
        <Navbar></Navbar>
        <h1 className="main-heading">Welcome to Bop Swap</h1>
        <div className = "split-container">
          <div className = "left-split">
            <span className="left-header">Create Communities and Share the Music you Love </span>

            <p className= "left-body">
              Bop Swap is your home for building community and sharing  playlists with friends and family.
              <br /> <br />In community groups you can post, share, and swap playlists for unlimited music discovery              
              </p>

          </div>
          <div className = "right-split">
            <div className="right-header">Ready to Get Started?</div>
            <div className="right-content">
              <div>
              <div className="right-body">Sign up or log in to get sharing!</div>
                <button style = 
                {{
                  padding: '5rem 3rem',
                  fontSize: '1.9rem',
                  background: 'rgba(213, 179, 255, 0.05)',
                  color: '#db3ea9'
                }} onClick={signInToGoogle}>Get Started</button>
              </div>
            </div>
          </div>
        </div>

    </>
  )
}

export default LandingPage
