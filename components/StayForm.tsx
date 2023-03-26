import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import supabase from '@/lib/supabase';
import Alert from './Alert';
import Input from './Input';
import Loader from './Loader';
import LocationSearch from './LocationSearch';
import PrimaryButton from './PrimaryButton';
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
  initialTimezoneName
}) {
  const session = supabase.auth.session();

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
  const [timezoneName, setTimezoneName] = useState(initialTimezoneName);

  const [location, setLocation] = useState();

  // Account for delay of router query param from main page component
  useEffect(() => {
    setTripUuid(initialTripUuid);
  }, [initialTripUuid]);

  /**
   * Calculate dates and times
   */

  const [checkinDate, setCheckinDate] = checkinTimestamp ? useState(format(utcToZonedTime(checkinTimestamp, timezoneName), 'yyyy-MM-dd')) : useState(null);
  const [checkinTime, setCheckinTime] = checkinTimestamp ? useState(format(utcToZonedTime(checkinTimestamp, timezoneName), 'HH:mm')) : useState(null);

  const [checkoutDate, setCheckoutDate] = checkoutTimestamp ? useState(format(utcToZonedTime(checkoutTimestamp, timezoneName), 'yyyy-MM-dd')) : useState(null);
  const [checkoutTime, setCheckoutTime] = checkoutTimestamp ? useState(format(utcToZonedTime(checkoutTimestamp, timezoneName), 'HH:mm')) : useState(null);

  /**
   * Automatically set timezone and coordinates
   */

  async function getTimezone(latitude, longitude) {
    const { data } = await axios(`/api/timezones?lat=${latitude}&lon=${longitude}`);
    return data[0];
  }

  async function selectLocation(selected) {
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

  async function updateStay(e) {
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

    const headers = { Authorization: `Bearer ${session.access_token}` };

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
      <Alert type="success">
        {successMessage}
      </Alert>
    );
  }

  return (
    <div className="max-w-lg">
      {errorMessage &&
        <Alert type="error">
          {errorMessage}
        </Alert>
      }

      <form onSubmit={updateStay}>
        <div className="mb-6">
          <label className="block font-bold mb-1 text-xs uppercase">Assigned Trip</label>
          <TripSelect value={tripUuid} onChange={e => setTripUuid(e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-1 text-xs uppercase">Name</label>
          <LocationSearch value={location} initialValue={name} onSelect={selectLocation} addClass="w-full" />
        </div>

        <div className="flex gap-4 mb-6">
          <div className="grow shrink-0">
            <Input label="Address" type="text" addClass="w-full" value={address} onChange={e => setAddress(e.target.value)} disabled />
          </div>

          <div className="grow-0 shrink">
            <Input label="Timezone" value={timezoneName} onChange={e => setTimezoneName(e.target.value)} required disabled />
          </div>
        </div>

        <div className="mb-6">
          <Input label="Confirmation Number" type="text" value={confirmationNumber} onChange={e => setConfirmationNumber(e.target.value)} />
        </div>

        <div className="flex gap-4 mb-6">
          <Input label="Check-In Date" type="date" value={checkinDate} onChange={e => setCheckinDate(e.target.value)} required />

          <Input label="Check-In Time" type="time" value={checkinTime} onChange={e => setCheckinTime(e.target.value)} required />
        </div>

        <div className="flex gap-4 mb-8">
          <Input label="Check-Out Date" type="date" value={checkoutDate} onChange={e => setCheckoutDate(e.target.value)} required />

          <Input
            label="Check-Out Time" type="time" addClass="w-full" value={checkoutTime} onChange={e => setCheckoutTime(e.target.value)} required />
        </div>

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    </div>
  );
}
