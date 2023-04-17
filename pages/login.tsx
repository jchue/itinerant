import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import Alert from '@/components/Alert';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import PrimaryButton from '@/components/PrimaryButton';

function LoginForm() {
  const router = useRouter();

  const session = supabase.auth.session();

  const nextPath = useRef('/');

  useEffect(() => {
    if (router.query.redirect) nextPath.current = router.query.redirect.toString();

    // Redirect to page if logged in
    if (session) router.push(nextPath.current);
  }, []);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
  
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });
  
      if (error) throw error;
  
      setSuccessMessage('Login successful!');

      return router.push(nextPath.current);
    } catch (error: any) {
      setErrorMessage(error.message);
  
      return null;
    } finally {
      setLoading(false);
    }
  }

  if (successMessage) {
    return (
      <Alert type="success">
        {successMessage}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      {errorMessage && (
        <Alert type="error" addClass="mb-6">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="p-10 rounded-lg shadow">
        <Input type="email" label="Email" addClass="mb-4 w-full" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
        <Input type="password" label="Password" addClass="mb-6 w-full" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />

        <div className="flex items-center">
          <Link href="/reset" className="flex-1 mr-4 text-emerald-500 text-xs hover:text-emerald-400">
            Forgot password?
          </Link>
          <PrimaryButton type="submit">Log In</PrimaryButton>
        </div>
      </form>
    </>
  );
}

export default function Login() {
  return (
    <>
      <div className="mt-10 mx-auto max-w-sm">
        <PageTitle addClass="mb-6 text-center">Log In</PageTitle>
        <LoginForm />
      </div>
    </>
  );
}
