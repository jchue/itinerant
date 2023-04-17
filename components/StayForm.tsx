import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import supabase from '@/lib/supabase';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';
import Input from './Input';
import Loader from './Loader';
import LocationSearch from './LocationSearch';
import PrimaryButton from './PrimaryButton';
import TertiaryButton from './TertiaryButton';
import TripSelect from './TripSelect';

export default function StayForm({
  stayUuid,
  initialTripUuid,
  initialName,
  initialAddress,
  initialLatitude,
  initialLongitude,
  initialConfirmationNumber,
  initialCheckinTimestamp,
  initialCheckoutTimestamp,
  initialTimezoneName,
}: {
  stayUuid?: string,
  initialTripUuid: string,
  initialName?: string,
  initialAddress?: string,
  initialLatitude?: number,
  initialLongitude?: number,
  initialConfirmationNumber?: string,
  initialCheckinTimestamp?: Date,
  initialCheckoutTimestamp?: Date,
  initialTimezoneName?: string,
}) {
  const session = supabase.auth.session();

  const [isEdited, setIsEdited] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Get any initialized props
   */

  const [tripUuid, setTripUuid] = useState(initialTripUuid);
  const [name, setName] = useState(initialName);
  const [address, setAddress] = useState(initialAddress);
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [confirmationNumber, setConfirmationNumber] = useState(initialConfirmationNumber);
  const [checkinTimestamp, setCheckinTimestamp] = useState(initialCheckinTimestamp);
  const [checkoutTimestamp, setCheckoutTimestamp] = useState(initialCheckoutTimestamp);
  const [timezoneName, setTimezoneName] = useState(initialTimezoneName || 'Etc/UTC');

  const [location, setLocation] = useState();

  // Account for delay of router query param from main page component
  useEffect(() => {
    setTripUuid(initialTripUuid);
  }, [initialTripUuid]);

  /**
   * Calculate dates and times
   */

  const [checkinDate, setCheckinDate] = useState(checkinTimestamp ? format(utcToZonedTime(checkinTimestamp, timezoneName), 'yyyy-MM-dd') : undefined);
  const [checkinTime, setCheckinTime] = useState(checkinTimestamp ? format(utcToZonedTime(checkinTimestamp, timezoneName), 'HH:mm') : undefined);

  const [checkoutDate, setCheckoutDate] = useState(checkoutTimestamp ? format(utcToZonedTime(checkoutTimestamp, timezoneName), 'yyyy-MM-dd') : undefined);
  const [checkoutTime, setCheckoutTime] = useState(checkoutTimestamp ? format(utcToZonedTime(checkoutTimestamp, timezoneName), 'HH:mm') : undefined);

  /**
   * Automatically set timezone and coordinates
   */

  async function getTimezone(latitude: number, longitude: number) {
    const { data } = await axios(`/api/timezones?lat=${latitude}&lon=${longitude}`);
    return data[0];
  }

  async function selectLocation(selected: any) {
    setLocation(selected);

    if (selected) {
      const houseNumber = selected.properties.housenumber ? `${selected.properties.housenumber} ` : '';
      const street = selected.properties.street ? `${selected.properties.street}, ` : '';
      const city = selected.properties.city ? `${selected.properties.city}, ` : '';
      const state = selected.properties.state ? `${selected.properties.state}` : '';
      const postCode = selected.properties.postcode ? ` ${selected.properties.postcode}` : '';
      const country = selected.properties.country ? `, ${selected.properties.country}` : '';
      setAddress(houseNumber + street + city + state + postCode + country);

      const latitude = selected.geometry.coordinates[1];
      setLatitude(latitude);

      const longitude = selected.geometry.coordinates[0];
      setLongitude(longitude);
    
      const timezoneName = await getTimezone(latitude, longitude);
      setTimezoneName(timezoneName);

      setName(selected.properties.name);
    }
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle form
   */

  async function updateStay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check required fields
    if (
      !tripUuid
      || !name
      || !checkinDate
      || !checkinTime
      || !checkoutDate
      || !checkoutTime
      || !timezoneName
    ) {
      setLoading(false);
      setErrorMessage('Assigned Trip, Name, Check-In Date, Check-In Time, Check-Out Date, Check-Out Time, and Timezone are required.');

      return;
    }

    const body = {
      tripUuid,
      name,
      address,
      latitude,
      longitude,
      confirmationNumber,
      checkinTimestamp: zonedTimeToUtc(`${checkinDate} ${checkinTime}`, timezoneName),
      checkoutTimestamp: zonedTimeToUtc(`${checkoutDate} ${checkoutTime}`, timezoneName),
      timezoneName,
    };

    const headers = { Authorization: `Bearer ${session?.access_token}` };

    let nextPath = null;

    try {
      // If id exists, update; otherwise, create new
      if (stayUuid) {
        await axios({ url: `/api/stays/${stayUuid}`, method: 'put', data: body, headers });
        nextPath = `/stays/${stayUuid}`;
        setSuccessMessage('The stay has been updated!');
      } else {
        const { data } = await axios({ url: '/api/stays', method: 'post', data: body, headers });
        nextPath = `/stays/${data.uuid}`;
        setSuccessMessage('The stay has been created!');
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
      {errorMessage &&
        <Alert type="error" addClass="max-w-sm mx-auto mb-6">
          {errorMessage}
        </Alert>
      }

      <form onChange={() => setIsEdited(true)} onSubmit={updateStay}>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <TripSelect label="Assigned Trip" value={tripUuid} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTripUuid(e.target.value)} />
          </div>
          <div className="flex-none">
            <Input label="Confirmation Number" type="text" size={6} value={confirmationNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmationNumber(e.target.value)} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-xs uppercase">Name</label>
          <LocationSearch
            initialValue={name}
            onSelect={selectLocation}
            addClass="w-full"
            osmTag={{
              key: 'tourism',
              value: 'hotel',
            }}
          />
        </div>

        <div className="flex gap-4 mb-6">
          <div className="grow shrink-0">
            <Input label="Address" type="text" value={address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)} disabled />
          </div>

          <div className="grow-0 shrink">
            <Input label="Timezone" value={timezoneName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTimezoneName(e.target.value)} required disabled />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Input label="Check-In Date" type="date" value={checkinDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckinDate(e.target.value)} required />

          <Input label="Check-In Time" type="time" value={checkinTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckinTime(e.target.value)} required />
        </div>

        <div className="flex gap-4 mb-8">
          <Input label="Check-Out Date" type="date" value={checkoutDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckoutDate(e.target.value)} required />

          <Input
            label="Check-Out Time" type="time" value={checkoutTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckoutTime(e.target.value)} required />
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
