import { useState } from 'react';
import supabase from '@/lib/supabase';
import Alert from '@/components/Alert';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import PrimaryButton from '@/components/PrimaryButton';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function register(e) {
    e.preventDefault();

    try {
      setErrorMessage(null);
      setLoading(true);
  
      // Check required fields
      if (!email || !password) {
        throw new Error('Email and Password are required.');
      }
  
      // Simple email format check
      const regex = /.+@.+\..+/g;
      if (!regex.test(email)) {
        throw new Error('Invalid Email');
      }
  
      // Enforce password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
  
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) throw error;
  
      setSuccessMessage('Please check your email for a verification link.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 mx-auto max-w-sm">
      <PageTitle addClass="mb-6 text-center">Register</PageTitle>

      {loading ? (
        <Loader />
      ) : successMessage ? (
        <Alert type="success">
          {successMessage}
        </Alert>
      ) : (
        <>
          {errorMessage &&
            <Alert type="error" addClass="mb-6">
              {errorMessage}
            </Alert>
          }

          <form onSubmit={register} className="p-10 rounded-lg shadow-lg">
            <Input type="email" label="Email" addClass="mb-4 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input
              type="password"
              label="Password"
              addClass="mb-6 w-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div className="text-right">
              <PrimaryButton type="submit">Register</PrimaryButton>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
