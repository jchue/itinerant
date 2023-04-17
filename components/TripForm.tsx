import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import supabase from '@/lib/supabase';
import Alert from './Alert';
import CitySearch from './CitySearch';
import ConfirmationModal from './ConfirmationModal';
import Input from './Input';
import Loader from './Loader';
import PrimaryButton from './PrimaryButton';
import TertiaryButton from './TertiaryButton';

export default function TripForm({ initialName = '', initialDestination, tripUuid }: { initialName?: string, initialDestination?: string, tripUuid?: string }) {
  // Get current session
  const session = supabase.auth.session();

  const [isEdited, setIsEdited] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Get any initialized props
   */

  const [name, setName] = useState(initialName);
  const [destination, setDestination] = useState(initialDestination);

  async function selectDestination(selected: any) {
    if (selected) {
      const city = selected.properties.name ? `${selected.properties.name}` : '';
      const state = selected.properties.state ? `, ${selected.properties.state}` : '';
      const country = selected.properties.country ? `, ${selected.properties.country}` : '';
    
      setDestination(city + state + country);
    }
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle form
   */

  async function updateTrip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check required fields
    if (!name || !destination) {
      setLoading(false);
      setErrorMessage('Name and Destination are required.');
  
      return;
    }
  
    const body = {
      name,
      destination,
    };
  
    const headers = {
      Authorization: `Bearer ${session?.access_token}`,
    };
  
    let nextPath = null;
  
    try {
      // If id exists, update; otherwise, create new
      if (tripUuid) {
        await axios({ url: `/api/trips/${tripUuid}`, method: 'put', data: body, headers });
        nextPath = `/trips/${tripUuid}`;
        setSuccessMessage('The trip has been updated!');
      } else {
        const { data } = await axios({ url: '/api/trips', method: 'post', data: body, headers });
        nextPath = `/trips/${data.uuid}`;
        setSuccessMessage('The trip has been created!');
      }
  
      router.push(nextPath);
    } catch (error) {
      setErrorMessage('Uh oh, something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Loader />
    );
  }

  if (successMessage) {
    return (
      <Alert type="success" addClass="max-w-sm mx-auto">
        {successMessage}
      </Alert>
    );
  }

  return (
    <div className="p-8 rounded-lg shadow">
      {errorMessage && (
        <Alert type="error" addClass="max-w-sm mx-auto mb-6">
          {errorMessage}
        </Alert>
      )}

      <form onChange={() => setIsEdited(true)} onSubmit={updateTrip}>
        <div className="mb-4">
          <Input label="Name" type="text" addClass="w-full" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-xs uppercase">Primary Destination City</label>
          <CitySearch
            initialValue={destination}
            onSelect={selectDestination}
            addClass="w-full"
          />
        </div>
        <div className="text-right">
          <TertiaryButton onClick={() => { isEdited ? setShowConfirm(true) : router.back() }}>Cancel</TertiaryButton>
          <PrimaryButton type="submit">Submit</PrimaryButton>

          {showConfirm &&
            <ConfirmationModal title="Discard Changes" onCancel={() => setShowConfirm(false)} onConfirm={() => router.back()}>
              You have unsaved changes. Do you want to proceed without saving them?
            </ConfirmationModal>
          }
        </div>
      </form>
    </div>
  );
}
