import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Alert from '@/components/Alert';
import DeleteButton from '@/components/DeleteButton';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import PrimaryButton from '@/components/PrimaryButton';

export default function Profile() {
  const user = supabase.auth.user();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const [email, setEmail] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(null);

  useEffect(() => {
    setEmail(user?.email);
  }, []);

  async function updateProfile(e) {
    e.preventDefault();

    try {
      setLoading(true);
  
      // Check required fields
      if (!email) {
        throw new Error('Email and Password are required.');
      }
  
      // Simple email format check
      const regex = /.+@.+\..+/g;
      if (!regex.test(email)) {
        throw new Error('Invalid Email');
      }
  
      const { error } = await supabase.auth.update({
        email,
      });
  
      if (error) throw error;
  
      setSuccessMessage('Please check your email for a verification link.');
    } catch (error) {
      setErrorMessage('Oops. Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();

    try {
      setErrorMessage(null);
      setLoading(true);
  
      // Check required fields
      if (!currentPassword || !newPassword || !newPasswordConfirm) {
        throw new Error('All password fields are required.');
      }
  
      // Enforce password length
      if (newPassword.length < 6 || newPasswordConfirm.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }
  
      await validateCurrentPassword();
      confirmNewPassword();
  
      const { error } = await supabase.auth.update({
        password: newPassword,
      });
  
      if (error) throw new Error('Oops. Something went wrong.');
  
      setSuccessMessage('Password updated!');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function validateCurrentPassword() {
    const { error } = await supabase.auth.signIn({
      email,
      password: currentPassword,
    });
  
    if (error) throw new Error('Incorrect password');
  }
  
  function confirmNewPassword() {
    if (newPassword !== newPasswordConfirm) {
      throw new Error('Passwords do not match.');
    }
  }

  return (
    <div className="max-w-md">
      <header className="mb-6">
        <PageTitle>Profile</PageTitle>
      </header>

      {loading ? (
        <Loader />
      ) : successMessage ? (
        <>
          <Alert type="success">
            {successMessage }
          </Alert>
        </>
      ) : (
        <>
          {errorMessage &&
            <Alert type="error" addClass="mb-6">
              {errorMessage}
            </Alert>
          }

          <form onSubmit={updateProfile} className="mb-12">
            <Input label="Email" type="email" addClass="mb-6" value={email} onChange={e => setEmail(e.target.value)} required />

            <PrimaryButton type="submit">Update Email</PrimaryButton>
          </form>

          <form onSubmit={changePassword} className="mb-12">
            <Input
              label="Current Password"
              type="password"
              addClass="mb-4"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              label="New Password"
              type="password"
              addClass="mb-4"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              addClass="mb-6"
              value={newPasswordConfirm}
              onChange={e => setNewPasswordConfirm(e.target.value)}
              required
            />

            <PrimaryButton type="submit">Change Password</PrimaryButton>
          </form>

          <DeleteButton type="button" itemType="user" addClass="mb-6">Delete Account</DeleteButton>
        </>
      )}
    </div>
  );
}
