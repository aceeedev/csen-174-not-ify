import { useEffect, useState } from 'react'
import { auth, getCurrentUserFromFirebase } from '../firebase';
import type { User } from '../models';
import LandingPage from './landingPage/LandingPage';
import UserHomePage from './userHomePage/userHomePage';
import { onAuthStateChanged } from 'firebase/auth';


function IndexPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (_) => {
          setUser(await getCurrentUserFromFirebase());
        });
    
        return () => unsubscribe();
      }, []);

  return (
    <>
      { user !== null ? <UserHomePage></UserHomePage> : <LandingPage></LandingPage> }
    </>
  )
}

export default IndexPage
