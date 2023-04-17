import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import supabase from '@/lib/supabase';
import { Airline, Airport } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import AirlineSelect from './AirlineSelect';
import AirportSelect from './AirportSelect';
import Alert from './Alert';
import ConfirmationModal from './ConfirmationModal';
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
}: {
  flightUuid?: string,
  initialTripUuid: string,
  initialAirline?: Airline,
  initialFlightNumber?: number,
  initialDepartureAirport?: Airport,
  initialDepartureTimestamp?: Date,
  initialDepartureTimezoneName?: string,
  initialArrivalAirport?: Airport,
  initialArrivalTimestamp?: Date,
  initialArrivalTimezoneName?: string,
  initialConfirmationNumber?: string,
}) {
  const session = supabase.auth.session();

  const [isEdited, setIsEdited] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Get any initialized props
   */

  const [tripUuid, setTripUuid] = useState(initialTripUuid);
  const [airline, setAirline] = useState(initialAirline);
  const [flightNumber, setFlightNumber]  = useState(initialFlightNumber?.toString());
  const [departureAirport, setDepartureAirport] = useState(initialDepartureAirport);
  const [departureTimestamp, setDepartureTimestamp] = useState(initialDepartureTimestamp);
  const [departureTimezoneName, setDepartureTimezoneName] = useState(initialDepartureTimezoneName || 'Etc/UTC');
  const [arrivalAirport, setArrivalAirport] = useState(initialArrivalAirport);
  const [arrivalTimestamp, setArrivalTimestamp] = useState(initialArrivalTimestamp);
  const [arrivalTimezoneName, setArrivalTimezoneName] = useState(initialArrivalTimezoneName || 'Etc/UTC');
  const [confirmationNumber, setConfirmationNumber] = useState(initialConfirmationNumber);

  // Account for delay of router query param from main page component
  useEffect(() => {
    setTripUuid(initialTripUuid);
  }, [initialTripUuid]);

  /**
   * Calculate dates and times
   */

  const [departureDate, setDepartureDate] = useState(departureTimestamp ? format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'yyyy-MM-dd') : undefined);
  const [departureTime, setDepartureTime] = useState(departureTimestamp ? format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'HH:mm') : undefined);

  const [arrivalDate, setArrivalDate] = useState(arrivalTimestamp ? format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'yyyy-MM-dd') : undefined);
  const [arrivalTime, setArrivalTime] = useState(arrivalTimestamp ? format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'HH:mm') : undefined);

  /**
   * Automatically set timezones
   */

  async function getTimezone(latitude: Decimal | null, longitude: Decimal | null) {
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

  async function updateFlight(e: React.FormEvent<HTMLFormElement>) {
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

    const headers = { Authorization: `Bearer ${session?.access_token}` };

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

      <form onChange={() => setIsEdited(true)} onSubmit={updateFlight}>
        <fieldset className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <TripSelect label="Assigned Trip" value={tripUuid} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTripUuid(e.target.value)} />
            </div>
            <div className="flex-none">
              <Input
                label="Confirmation Number"
                type="text"
                size={6}
                value={confirmationNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmationNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <AirlineSelect label="Airline" value={airline} onChange={(selected: Airline) => setAirline(selected)} />
            </div>
            <div className="flex-none">
              <Input
                label="Flight Number"
                type="text"
                size={6}
                addClass="w-auto"
                value={flightNumber?.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlightNumber(e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <Legend addClass="mb-4">Departure</Legend>

          <AirportSelect label="Airport" value={departureAirport} onChange={(selected: Airport) => { setDepartureAirport(selected); getTimezone(selected.latitude, selected.longitude).then((timezone) => setDepartureTimezoneName(timezone))}} addClass="mb-4" />

          <div className="flex gap-4">
            <Input label="Date" type="date" value={departureDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartureDate(e.target.value)} required />

            <Input label="Time" type="time" value={departureTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartureTime(e.target.value)} required />

            <Input label="Timezone" value={departureTimezoneName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartureTimezoneName(e.target.value)} required disabled addClass="flex-1" />
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <Legend addClass="mb-4">Arrival</Legend>

          <AirportSelect label="Airport" value={arrivalAirport} onChange={(selected: Airport) => { setArrivalAirport(selected); getTimezone(selected.latitude, selected.longitude).then((timezone) => setArrivalTimezoneName(timezone))}} addClass="mb-4" />

          <div className="flex gap-4">
            <Input label="Date" type="date" value={arrivalDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArrivalDate(e.target.value)} required />

            <Input label="Time" type="time" value={arrivalTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) =>setArrivalTime(e.target.value)} required />

            <Input label="Timezone" value={arrivalTimezoneName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArrivalTimezoneName(e.target.value)} required disabled addClass="flex-1" />
          </div>
        </fieldset>

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
