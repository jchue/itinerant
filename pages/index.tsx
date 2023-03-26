import { useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();

  const session = supabase.auth.session();

  useEffect(() => {
    // Redirect to trips if logged in
    if (session) router.replace('/trips');
  }, []);
  
  return (
    <>
    </>
  );
}
