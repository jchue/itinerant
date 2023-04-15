import { useRouter } from 'next/router';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import 'material-symbols';

export default function Stay() {
  const router = useRouter();

  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/stays/${router.query.uuid}`, session?.access_token);

  let tripUuid,
  name,
  address,
  confirmationNumber,
  checkinDate,
  checkinTime,
  checkoutDate,
  checkoutTime,
  timezoneName;

  if (data) {
    tripUuid = data.tripUuid;
    name = data.name;
    address = data.address;
    confirmationNumber = data.confirmationNumber;
    checkinDate = format(utcToZonedTime(data.checkinTimestamp, data.timezoneName), 'EEE, MMM d, yyyy');
    checkinTime = format(utcToZonedTime(data.checkinTimestamp, data.timezoneName), 'p');
    checkoutDate = format(utcToZonedTime(data.checkoutTimestamp, data.timezoneName), 'EEE, MMM d, yyyy');
    checkoutTime = format(utcToZonedTime(data.checkoutTimestamp, data.timezoneName), 'p');
    timezoneName = data.timezoneName;
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
              title="Delete stay"
              itemType="stay"
              itemUuid={router.query.uuid}
              tripUuid={tripUuid}
              addClass="flex items-center mr-4 text-gray-500 text-sm uppercase hover:text-gray-600"
            >
              <span className="material-symbols-sharp material-symbols-extralight mr-1 text-xl">delete</span>
              <span>Delete</span>
            </DeleteButton>

            <Link
              href={`/stays/${router.query.uuid}/edit`}
              className="flex items-center text-gray-500 text-sm uppercase hover:text-gray-600"
            >
              <span className="material-symbols-sharp material-symbols-extralight mr-1 text-xl">edit</span>
              <span>Edit</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center mb-2">

          {/* Badge */}
          <div className="bg-emerald-700 mr-1.5 rounded-l-lg">
            <span className="material-symbols-sharp p-2 text-5xl text-white">bed</span>
          </div>

          <h1 className="bg-emerald-700 font-bold leading-none mr-2 p-2 rounded-r-lg text-2xl text-white uppercase">
            {name}
          </h1>

        </div>

        {/* Confirmation number */}
        <div className="flex items-center bg-gray-200 px-2.5 py-2 rounded-md w-min">
          <span className="leading-none mr-2 text-emerald-500 text-xs uppercase">Confirmation</span>
          <span className="font-bold leading-none text-emerald-700">{confirmationNumber}</span>
        </div>

      </header>

      <main>
        <div className="mb-8">
          <span className="material-symbols-sharp align-middle mr-2 text-2xl text-emerald-700">location_on</span>
          <span className="align-middle text-xs text-gray-600">{address}</span>
        </div>

        <div className="flex items-center mb-8">

          <div>
            <span className="block text-gray-600 text-xs uppercase">Check-In</span>
            <span className="block font-bold -mb-1 text-emerald-700 text-2xl">{checkinDate}</span>
            <span className="block text-emerald-700 text-sm">{checkinTime}</span>
            <span className="block text-gray-600 text-[0.625rem]">{timezoneName}</span>
          </div>
          <div className="flex-1"></div>
          <div>
            <span className="block text-gray-600 text-xs uppercase">Check-Out</span>
            <span className="block font-bold -mb-1 text-emerald-700 text-2xl">{checkoutDate}</span>
            <span className="block text-emerald-700 text-sm">{checkoutTime}</span>
            <span className="block text-gray-600 text-[0.625rem]">{timezoneName}</span>
          </div>

        </div>
      </main>
    </div>
  );
}
