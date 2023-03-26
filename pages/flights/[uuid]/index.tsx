import { useRouter } from 'next/router';
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';

export default function Flight() {
  const router = useRouter();
  
  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/flights/${router.query.uuid}`, session?.access_token);

  let tripUuid,
  airlineName,
  flightDesignator,
  departureAirportCode,
  departureDate,
  departureTime,
  departureTimezoneName,
  arrivalAirportCode,
  arrivalDate,
  arrivalTime,
  arrivalTimezoneName,
  duration,
  confirmationNumber;

  if (data) {
    tripUuid = data.tripUuid;
    airlineName = data.airline ? data.airline.name : null;
    flightDesignator = data.airline ? `${data.airline.code} ${data.flightNumber}` : null;
    departureAirportCode = data.departureAirport ? data.departureAirport.code : null;
    departureDate = format(utcToZonedTime(data.departureTimestamp, data.departureTimezoneName), 'EEE, MMM d, yyyy');
    departureTime = format(utcToZonedTime(data.departureTimestamp, data.departureTimezoneName), 'p');
    departureTimezoneName = data.departureTimezoneName;
    arrivalAirportCode = data.arrivalAirport ? data.arrivalAirport.code : null;
    arrivalDate = format(utcToZonedTime(data.arrivalTimestamp, data.arrivalTimezoneName), 'EEE, MMM d, yyyy');
    arrivalTime = format(utcToZonedTime(data.arrivalTimestamp, data.arrivalTimezoneName), 'p');
    arrivalTimezoneName = data.arrivalTimezoneName;
    duration = intervalToDuration({
      start: new Date(data.departureTimestamp),
      end: new Date(data.arrivalTimestamp),
    });
    confirmationNumber = data.confirmationNumber;
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
    <>
      <header className="mb-6">
        <div>
          <Link
            href={`/trips/${tripUuid}`}
            className="text-gray-300 text-sm uppercase hover:text-gray-400"
          >
            &larr; Trip
          </Link>
        </div>
        <div className="flex items-center">
          <PageTitle addClass="mr-2">
            {airlineName} {flightDesignator}
          </PageTitle>

          <DeleteButton
            itemType="flight"
            itemUuid={router.query.uuid}
            tripUuid={tripUuid}
            addClass="float-left"
          />

          <Link href={`/flights/${router.query.uuid}/edit`} className="float-left">
            <span className="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
          </Link>
        </div>
      </header>

      <main>
        <div className="flex items-center mb-8">

          <div>
            <span className="text-gray-600 text-xs uppercase">Depart</span>
            <span className="block text-emerald-700 text-sm">{departureDate}</span>
            <div>
              <div className="align-top inline-block mr-4">
                <span className="block font-bold -mb-1 text-emerald-700 text-2xl">
                  {departureTime}
                </span>
                <span className="block text-gray-600 text-[0.625rem]">{departureTimezoneName}</span>
              </div>
              <div className="align-top inline-block">
                <span className="block font-light text-gray-600 text-2xl">
                  {departureAirportCode}
                </span>
              </div>
            </div>
          </div>

          <div className="px-32 text-center">
            <span className="font-light text-gray-500 text-sm">
            {duration.years ? duration.years + 'y' : ''} {duration.months ? duration.months + 'm' : ''} {duration.days ? duration.days + 'd' : ''} {duration.hours ? duration.hours + 'h' : ''} {duration.minutes ? duration.minutes + 'm' : ''}
            </span>
          </div>

          <div>
            <span className="text-gray-600 text-xs uppercase">Arrive</span>
            <span className="block text-emerald-700 text-sm">{arrivalDate}</span>
            <div>
              <div className="align-top inline-block mr-4">
                <span className="block font-bold -mb-1 text-emerald-700 text-2xl">
                  {arrivalTime}
                </span>
                <span className="block text-gray-600 text-[0.625rem]">{arrivalTimezoneName}</span>
              </div>
              <div className="align-top inline-block">
                <span className="block font-light text-gray-600 text-2xl">
                  {arrivalAirportCode}
                </span>
              </div>
            </div>
          </div>

        </div>

        <div>
          <span className="block text-gray-600 text-xs uppercase">Confirmation Number</span>
          <span className="font-bold">{confirmationNumber}</span>
        </div>
      </main>
    </>
  );
}
