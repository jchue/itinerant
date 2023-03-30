import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import supabase from '@/lib/supabase';
import Alert from './Alert';
import CitySearch from './CitySearch';
import Input from './Input';
import Loader from './Loader';
import PrimaryButton from './PrimaryButton';

export default function TripForm({ initialName = '', initialDestination, tripUuid }) {
  // Get current session
  const session = supabase.auth.session();

  const [name, setName] = useState(initialName);
  const [destination, setDestination] = useState(initialDestination);

  async function selectDestination(selected) {
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

  async function updateTrip(e) {
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
      Authorization: `Bearer ${session.access_token}`,
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
      <Alert type="success">
        {successMessage}
      </Alert>
    );
  }

  return (
    <div className="max-w-sm">
      {errorMessage && (
        <Alert type="error" addClass="mb-6">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={updateTrip}>
        <div className="mb-4">
          <Input label="Name" type="text" addClass="w-full" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="block font-bold mb-1 text-xs uppercase">Primary Destination City</label>
          <CitySearch
            initialValue={destination}
            onSelect={selectDestination}
            addClass="w-full"
          />
        </div>
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    </div>
  );
}
