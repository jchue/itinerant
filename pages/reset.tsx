import { useState } from 'react';
import supabase from '@/lib/supabase';
import Alert from '@/components/Alert';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import PrimaryButton from '@/components/PrimaryButton';

export default function Reset() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');

  async function reset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage('');
  
      await supabase.auth.api.resetPasswordForEmail(email);
  
      setSuccessMessage('If the email is associated with an account, you will receive a link shortly.');
    } catch (error) {
      // Return success regardless
      setSuccessMessage('If the email is associated with an account, you will receive a link shortly.');
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
        <Alert type="success">
          {successMessage}
        </Alert>
      ) : (
        <>
          {errorMessage &&
            <Alert type="error">
              {errorMessage}
            </Alert>
          }

          <form onSubmit={reset}>
            <Input type="email" label="Email" addClass="mb-6" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />

            <PrimaryButton type="submit">Reset</PrimaryButton>
          </form>
        </>
      )}
    </>
  );
}
