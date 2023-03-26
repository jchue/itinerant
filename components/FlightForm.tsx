import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Alert from './Alert';
import Input from './Input';
import Loader from './Loader'
import PrimaryButton from './PrimaryButton';
import TripSelect from './TripSelect';

export default function FlightForm({
  flightUuid,
  initialTripUuid,
  initialAirlineCode,
  initialFlightNumber,
  initialDepartureAirportCode,
  initialDepartureTimestamp,
  initialDepartureTimezoneName,
  initialArrivalAirportCode,
  initialArrivalTimestamp,
  initialArrivalTimezoneName,
  initialConfirmationNumber,
}) {
  const session = supabase.auth.session();

  /**
   * Get any initialized props
   */

  const [tripUuid, setTripUuid] = useState(initialTripUuid);
  const [airlineCode, setAirlineCode] = useState(initialAirlineCode);
  const [flightNumber, setFlightNumber]  = useState(initialFlightNumber);
  const [departureAirportCode, setDepartureAirportCode] = useState(initialDepartureAirportCode);
  const [departureTimestamp, setDepartureTimstamp] = useState(initialDepartureTimestamp);
  const [departureTimezoneName, setDepartureTimezoneName] = useState(initialDepartureTimezoneName);
  const [arrivalAirportCode, setArrivalAirportCode] = useState(initialArrivalAirportCode);
  const [arrivalTimestamp, setArrivalTimestamp] = useState(initialArrivalTimestamp);
  const [arrivalTimezoneName, setArrivalTimezoneName] = useState(initialArrivalTimezoneName);
  const [confirmationNumber, setConfirmationNumber] = useState(initialConfirmationNumber);

  // Account for delay of router query param from main page component
  useEffect(() => {
    setTripUuid(initialTripUuid);
  }, [initialTripUuid]);

  /**
   * Calculate dates and times
   */

  const [departureDate, setDepartureDate] = departureTimestamp ? useState(format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'yyyy-MM-dd')) : useState(null);
  const [departureTime, setDepartureTime] = departureTimestamp ? useState(format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'HH:mm')) : useState(null);

  const [arrivalDate, setArrivalDate] = arrivalTimestamp ? useState(format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'yyyy-MM-dd')) : useState(null);
  const [arrivalTime, setArrivalTime] = arrivalTimestamp ? useState(format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'HH:mm')) : useState(null);

  /**
   * Get lookups
   */

  let isLoading, airlines, airports;
  ({ data: airlines, isLoading } = fetchWithToken('/api/airlines', session?.access_token));
  ({ data: airports, isLoading } = fetchWithToken('/api/airports', session?.access_token));

  /**
   * Automatically set timezones
   */

  async function getAirportTimezone(airportCode) {
    const airport = airports.find((airport) => airport.code === airportCode);
    const { data } = await axios(`/api/timezones?lat=${airport.latitude}&lon=${airport.longitude}`);
    return data[0];
  }

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle form
   */

  async function updateFlight(e) {
    e.preventDefault();

    // Check required fields
    if (
      !tripUuid
      || !airlineCode
      || !flightNumber
      || !departureAirportCode
      || !departureDate
      || !departureTime
      || !departureTimezoneName
      || !arrivalAirportCode
      || !arrivalDate
      || !arrivalTime
      || !arrivalTimezoneName
    ) {
      setLoading(false);
      setErrorMessage('Assigned Trip, Airline, Flight Number, Departure Airport, Departure Date, Departure Time, Departure Timezone, Arrival Airport, Arrival Date, Arrival Time, and Arrival Timezone are required.');

      return;
    }

    // Check flight number format
    if (Number.isNaN(Number(flightNumber))) {
      setLoading(false);
      setErrorMessage('Invalid Flight Number');

      return;
    }

    const body = {
      tripUuid,
      airlineCode,
      flightNumber: parseInt(flightNumber, 10),
      departureAirportCode,
      departureTimestamp: zonedTimeToUtc(`${departureDate} ${departureTime}`, departureTimezoneName),
      departureTimezoneName: departureTimezoneName,
      arrivalAirportCode,
      arrivalTimestamp: zonedTimeToUtc(`${arrivalDate} ${arrivalTime}`, arrivalTimezoneName),
      arrivalTimezoneName,
      confirmationNumber,
    };

    const headers = { Authorization: `Bearer ${session.access_token}` };

    let nextPath = null;

    try {
      // If id exists, update; otherwise, create new
      if (flightUuid) {
        await axios({ url: `/api/flights/${flightUuid}`, method: 'put', data: body, headers });
        nextPath = `/flights/${flightUuid}`;
        setSuccessMessage('The flight has been updated!');
      } else {
        const { data } = await axios({ url: '/api/flights', method: 'post', data: body, headers });
        nextPath = `/flights/${data.uuid}`;
        setSuccessMessage('The flight has been created!');
      }

      router.push(nextPath);
    } catch (error) {
      setErrorMessage('Uh oh, something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (loading || isLoading) {
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
        <Alert type="error" addClass="mb-6">
          {errorMessage}
        </Alert>
      }

      <form onSubmit={updateFlight}>
        <div className="mb-6">
          <label className="block font-bold mb-1 text-xs uppercase">Assigned Trip</label>
          <TripSelect value={tripUuid} onChange={e => setTripUuid(e.target.value)} />
        </div>

        <div className="flex gap-4 mb-6">
          <div>
            <label className="block font-bold mb-1 text-xs uppercase">Airline</label>
            <select
              value={airlineCode}
              onChange={e => setAirlineCode(e.target.value)}
              defaultValue=''
              className="bg-gray-200 border-2 outline-none p-2 rounded-md
              text-gray-700 text-sm w-full"
              required
            >
              <option value=''></option>
              {airlines.map((airline) => (
                <option key={airline.code} value={airline.code}>
                  {airline.name} ({airline.code})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Flight Number"
            type="text"
            size="6"
            addClass="w-auto"
            value={flightNumber}
            onChange={e => setFlightNumber(e.target.value)}
            required
          />
        </div>

        <fieldset className="mb-6">
          <legend className="font-bold mb-4">Departure</legend>

          <div className="mb-4">
            <label className="block font-bold mb-1 text-xs uppercase">Airport</label>
            <select
              value={departureAirportCode}
              onChange={async e => { setDepartureAirportCode(e.target.value); setDepartureTimezoneName(await getAirportTimezone(e.target.value))}}
              defaultValue=''
              className="bg-gray-200 border-2 outline-none p-2 rounded-md
              text-gray-700 text-sm w-full"
              required
            >
              <option value=''></option>
              {airports.map((airport) => (
                <option
                  key={airport.code}
                  value={airport.code}
                >
                  {airport.code} - {airport.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Input label="Date" type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />

            <Input label="Time" type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} required />

            <div>
              <Input label="Timezone" value={departureTimezoneName} onChange={e => setDepartureTimezoneName(e.target.value)} required disabled />
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="font-bold mb-4">Arrival</legend>

          <div className="mb-4">
            <label className="block font-bold mb-1 text-xs uppercase">Airport</label>
            <select
              value={arrivalAirportCode}
              onChange={async e => { setArrivalAirportCode(e.target.value); setArrivalTimezoneName(await getAirportTimezone(e.target.value))}}
              defaultValue=''
              className="bg-gray-200 border-2 outline-none p-2 rounded-md
              text-gray-700 text-sm w-full"
              required
            >
              <option value=''></option>
              {airports.map((airport) => (
                <option
                  key={airport.code}
                  value={airport.code}
                >
                  {airport.code} - {airport.name}
                </option>
              ))}
          </select>
          </div>

          <div className="flex gap-4">
            <Input label="Date" type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} required />

            <Input label="Time" type="time" value={arrivalTime} onChange={e =>setArrivalTime(e.target.value)} required />

            <div>
              <Input label="Timezone" value={arrivalTimezoneName} onChange={e => setArrivalTimezoneName(e.target.value)} required disabled />
            </div>
          </div>
        </fieldset>

        <Input
          label="Confirmation Number"
          type="text"
          size="6"
          addClass="mb-8"
          value={confirmationNumber}
          onChange={e => setConfirmationNumber(e.target.value)}
        />

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    </div>
  );
}
