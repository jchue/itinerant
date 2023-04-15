import { useRouter } from 'next/router';
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import 'material-symbols';

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
    <div className="max-w-screen-md mx-auto">
      <header className="mb-8">

        {/* Actions */}
        <div className="flex mb-4">
          <Link
            href={`/trips/${tripUuid}`}
            className="flex items-center text-gray-500 text-sm uppercase hover:text-gray-600"
          >
            <span className="material-symbols-sharp material-symbols-extralight mr-1 text-sm">arrow_back</span>
            <span>Trip</span>
          </Link>

          <div className="flex-1 flex justify-end">
            <DeleteButton
              title="Delete flight"
              itemType="flight"
              itemUuid={router.query.uuid}
              tripUuid={tripUuid}
              addClass="flex items-center mr-4 text-gray-500 text-sm uppercase hover:text-gray-600"
            >
              <span className="material-symbols-sharp material-symbols-extralight mr-1 text-xl">delete</span>
              <span>Delete</span>
            </DeleteButton>

            <Link
              href={`/flights/${router.query.uuid}/edit`}
              className="flex items-center text-gray-500 text-sm uppercase hover:text-gray-600"
            >
              <span className="material-symbols-sharp material-symbols-extralight mr-1 text-xl">edit</span>
              <span>Edit</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center mb-2">

          {/* Badge */}
          <div className="bg-emerald-700 font-bold flex items-center h-16 mr-2 rounded-lg text-4xl text-white">
            <div className="pr-3 pl-4">
              {departureAirportCode}
            </div>
            <div className="chevron w-6">
            </div>
            <div className="pr-4 pl-3">
              {arrivalAirportCode}
            </div>
          </div>

          {/* Flight designator */}
          <span className="inline-block border-2 border-emerald-700 font-bold leading-none mr-4 px-2 py-1.5 rounded-md uppercase text-emerald-700">
            {flightDesignator}
          </span>

        </div>

        {/* Confirmation number */}
        <div className="flex items-center bg-gray-200 mb-2 px-2.5 py-2 rounded-md w-min">
          <span className="leading-none mr-2 text-emerald-500 text-xs uppercase">Confirmation</span>
          <span className="font-bold leading-none text-emerald-700">{confirmationNumber}</span>
        </div>

      </header>

      <main>

        {/* Airline */}
        <div className="mb-8">
          <Image src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${data.airline.code}.svg`} alt={`${airlineName} lockup`} height="24" width="24" className="inline align-middle mr-2" />
          <span className="align-middle text-sm text-gray-600">{data.airline.name}</span>
        </div>

        <div className="flex items-center mb-12">

          {/* Departure */}
          <span className="material-symbols-sharp mt-8 mr-3 text-4xl text-emerald-700">flight_takeoff</span>
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

          {/* Duration */}
          <div className="flex-1 mt-8 mx-6 relative text-center">
            <span className="relative inline-block bg-white font-light px-2 text-gray-500 text-sm z-10">
              {duration.years ? duration.years + 'y' : ''} {duration.months ? duration.months + 'm' : ''} {duration.days ? duration.days + 'd' : ''} {duration.hours ? duration.hours + 'h' : ''} {duration.minutes ? duration.minutes + 'm' : ''}
            </span>

            <div className="border-t border-dotted border-gray-500 absolute inset-x-0 inset-y-1/2"></div>
          </div>

          {/* Arrival */}
          <span className="material-symbols-sharp mt-8 mr-3 text-4xl text-emerald-700">flight_land</span>
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
      </main>
    </div>
  );
}
