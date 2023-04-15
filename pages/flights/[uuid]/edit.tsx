import { useRouter } from 'next/router';
import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import FlightForm from '@/components/FlightForm';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';

export default function EditFlight() {
  const router = useRouter();

  const session = supabase.auth.session();

  const { data, error, isLoading } = useApiWithToken(`/api/flights/${router.query.uuid}`, session?.access_token);

  let tripUuid,
  airline,
  flightNumber,
  departureAirport,
  departureTimestamp,
  departureTimezoneName,
  arrivalAirport,
  arrivalTimestamp,
  arrivalTimezoneName,
  confirmationNumber;

  if (data) {
    ({
      tripUuid,
      airline,
      flightNumber,
      departureAirport,
      departureTimestamp,
      departureTimezoneName,
      arrivalAirport,
      arrivalTimestamp,
      arrivalTimezoneName,
      confirmationNumber } = data);
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error) {
    return (
      <NotFound />
    );
  }

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>Edit Flight</PageTitle>
      </header>

      <FlightForm
        flightUuid={router.query.uuid}
        initialTripUuid={tripUuid}
        initialAirline={airline}
        initialFlightNumber={flightNumber}
        initialDepartureAirport={departureAirport}
        initialDepartureTimestamp={departureTimestamp}
        initialDepartureTimezoneName={departureTimezoneName}
        initialArrivalAirport={arrivalAirport}
        initialArrivalTimestamp={arrivalTimestamp}
        initialArrivalTimezoneName={arrivalTimezoneName}
        initialConfirmationNumber={confirmationNumber}
      />
    </div>
  );
}