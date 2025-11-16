import Navbar from "../../components/Navbar"
import './LandingPage.css';
import { Link } from "react-router-dom";



function LandingPage() {

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
              <Link to="/landing">
                {/* TODO: Andrew, can we possibly get it so that this get started 
                button does the same thing as the sign in button? 
                If not, then the little right section can just be misc stats, like
                "X active users, 
                over Y songs posted and 
                Z playlists Shared "
                */}
                <button style = 
                {{
                  padding: '5rem 3rem',
                  fontSize: '1.9rem',
                  background: 'rgba(213, 179, 255, 0.05)',
                  color: '#db3ea9'
                }}>Get Started</button>
              </Link>
              </div>
            </div>
          </div>
        </div>

    </>
  )
}

export default LandingPage
