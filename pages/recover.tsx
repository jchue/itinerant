import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import Alert from '@/components/Alert';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import PrimaryButton from '@/components/PrimaryButton';

export default function Recover() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [password, setPassword] = useState('');

  async function updatePassword(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage('');
  
      const { error } = await supabase.auth.api.updateUser(router.query.access_token.toString(), {
        password,
      });
  
      if (error) throw error;
  
      setSuccessMessage('Password changed successfully!');
    } catch (error) {
      setErrorMessage('Oops. Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageTitle addClass="mb-6">Reset Password</PageTitle>

      {loading ? (
        <Loader />
      ) : successMessage ? (
        <>
          <Alert type="success" addClass="mb-6">
            {successMessage}
          </Alert>
      
          <PrimaryButton onClick={() => router.push('/')} href="/">Continue</PrimaryButton>
        </>
      ) : (
        <>
          {errorMessage &&
            <Alert type="error">
              {errorMessage}
            </Alert>
          }

          <form onSubmit={updatePassword}>
            <Input type="password" label="New Password" addClass="mb-6" value={password} onChange={e => setPassword(e.target.value)} required />

            <PrimaryButton type="submit">Submit</PrimaryButton>
          </form>
        </>
      )}
    </>
  );
}
