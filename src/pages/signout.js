import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios'

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const signOut = async () => {
        try{
            await axios.get(`${process.env.NEXT_PUBLIC_API}/signout`)
            router.push('/login')
        }
        catch(err){
            console.error(err.message)
        }
    };

    signOut();
  }, [router]);

  return null;
};

export default SignOutPage;
