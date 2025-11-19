import { useEffect, useState } from 'react'
import { auth, getCurrentUserFromFirebase } from '../firebase';
import type { firebaseUser } from '../models';
import LandingPage from './landingPage/LandingPage';
import UserHomePage from './userHomePage/userHomePage';
import { onAuthStateChanged } from 'firebase/auth';


function IndexPage() {
    const [user, setUser] = useState<firebaseUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userData = await getCurrentUserFromFirebase();
            setUser(userData);
          } else {
            setUser(null);
          }
          setLoading(false);
        });
    
        return () => unsubscribe();
      }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      { user !== null ? <UserHomePage></UserHomePage> : <LandingPage></LandingPage> }
    </>
  )
}

export default IndexPage
