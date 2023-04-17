import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import { User as UserType } from '@supabase/supabase-js';
import Link from 'next/link';
import 'material-symbols';

export default function User() {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(supabase.auth.user());
  }, []);

  // Detect log in/out
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      setUser(supabase.auth.user());

      return null;
    }

    if (event === 'SIGNED_OUT') {
      setUser(null);

      return router.push('/login');
    }

    return null;
  });

  async function logout() {
    await supabase.auth.signOut();
  
    return router.push('/login');
  }

  if (user) {
    return (
      <div>
        <Link
          href="/profile"
          className="align-middle mr-2 text-emerald-500 hover:text-emerald-400 text-sm" title="Edit Profile"
        >
          {user.email}
        </Link>

        <span
          onClick={logout}
          className="align-middle cursor-pointer material-symbols-sharp pr-2
          !text-xl text-emerald-500 hover:text-emerald-400"
          title="Log Out">
          logout
        </span>
      </div>
    );
  }

  return (
    <div className="text-gray-500 text-sm">
      <Link href="/register" className="text-emerald-500 hover:text-emerald-400">Register</Link>
      <span> | </span>
      <Link href="/login" className="text-emerald-500 hover:text-emerald-400">Log In</Link>
    </div>
  );
}
