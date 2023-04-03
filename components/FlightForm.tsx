import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import supabase from '@/lib/supabase';
import AirlineSelect from './AirlineSelect';
import AirportSelect from './AirportSelect';
import Alert from './Alert';
import Input from './Input';
import Legend from './Legend';
import Loader from './Loader'
import PrimaryButton from './PrimaryButton';
import TertiaryButton from './TertiaryButton';
import TripSelect from './TripSelect';

export default function FlightForm({
  flightUuid,
  initialTripUuid,
  initialAirline,
  initialFlightNumber,
  initialDepartureAirport,
  initialDepartureTimestamp,
  initialDepartureTimezoneName,
  initialArrivalAirport,
  initialArrivalTimestamp,
  initialArrivalTimezoneName,
  initialConfirmationNumber,
}) {
  const session = supabase.auth.session();

  /**
   * Get any initialized props
   */

  const [tripUuid, setTripUuid] = useState(initialTripUuid);
  const [airline, setAirline] = useState(initialAirline);
  const [flightNumber, setFlightNumber]  = useState(initialFlightNumber);
  const [departureAirport, setDepartureAirport] = useState(initialDepartureAirport);
  const [departureTimestamp, setDepartureTimestamp] = useState(initialDepartureTimestamp);
  const [departureTimezoneName, setDepartureTimezoneName] = useState(initialDepartureTimezoneName);
  const [arrivalAirport, setArrivalAirport] = useState(initialArrivalAirport);
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
   * Automatically set timezones
   */

  async function getTimezone(latitude, longitude) {
    const { data } = await axios(`/api/timezones?lat=${latitude}&lon=${longitude}`);
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
      || !airline
      || !flightNumber
      || !departureAirport
      || !departureDate
      || !departureTime
      || !departureTimezoneName
      || !arrivalAirport
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
      airlineCode: airline.code,
      flightNumber: parseInt(flightNumber, 10),
      departureAirportCode: departureAirport.code,
      departureTimestamp: zonedTimeToUtc(`${departureDate} ${departureTime}`, departureTimezoneName),
      departureTimezoneName: departureTimezoneName,
      arrivalAirportCode: arrivalAirport.code,
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

      <form onSubmit={updateFlight}>
        <fieldset className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <TripSelect label="Assigned Trip" value={tripUuid} onChange={e => setTripUuid(e.target.value)} />
            </div>
            <div className="flex-none">
              <Input
                label="Confirmation Number"
                type="text"
                size="6"
                value={confirmationNumber}
                onChange={e => setConfirmationNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <AirlineSelect label="Airline" value={airline} onChange={selected => setAirline(selected)} />
            </div>
            <div className="flex-none">
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
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <Legend addClass="mb-4">Departure</Legend>

          <AirportSelect label="Airport" value={departureAirport} onChange={selected => { setDepartureAirport(selected); getTimezone(selected.latitude, selected.longitude).then((timezone) => setDepartureTimezoneName(timezone))}} addClass="mb-4" />

          <div className="flex gap-4">
            <Input label="Date" type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} required />

            <Input label="Time" type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} required />

            <Input label="Timezone" value={departureTimezoneName} onChange={e => setDepartureTimezoneName(e.target.value)} required disabled addClass="flex-1" />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <Legend addClass="mb-4">Arrival</Legend>

          <AirportSelect label="Airport" value={arrivalAirport} onChange={selected => { setArrivalAirport(selected); getTimezone(selected.latitude, selected.longitude).then((timezone) => setArrivalTimezoneName(timezone))}} addClass="mb-4" />

          <div className="flex gap-4">
            <Input label="Date" type="date" value={arrivalDate} onChange={e => setArrivalDate(e.target.value)} required />

            <Input label="Time" type="time" value={arrivalTime} onChange={e =>setArrivalTime(e.target.value)} required />

            <Input label="Timezone" value={arrivalTimezoneName} onChange={e => setArrivalTimezoneName(e.target.value)} required disabled addClass="flex-1" />
          </div>
        </fieldset>

        <div className="text-right">
          <TertiaryButton addClass="mr-4" onClick={() => router.back()}>Cancel</TertiaryButton>
          <PrimaryButton type="submit">Submit</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
