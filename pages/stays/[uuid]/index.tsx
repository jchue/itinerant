import { useRouter } from 'next/router';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import NotFound from '@/components/NotFound';

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
    <>
      <header className="mb-4">
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
            {name}
          </PageTitle>

          <DeleteButton
            itemType="stay"
            itemUuid={router.query.uuid}
            tripUuid={tripUuid}
            addClass="float-left"
          />

          <Link href={`/stays/${router.query.uuid}/edit`} className="float-left">
            <span className="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
          </Link>
        </div>
      </header>

      <main>
        <span className="block mb-6 font-light text-gray-600">{address}</span>

        <div className="flex items-center mb-8">

          <div>
            <span className="block text-gray-600 text-xs uppercase">Check-In</span>
            <span className="block font-bold -mb-1 text-emerald-700 text-2xl">{checkinDate}</span>
            <span className="block text-emerald-700 text-sm">{checkinTime}</span>
            <span className="block text-gray-600 text-[0.625rem]">{timezoneName}</span>
          </div>
          <div className="px-32"></div>
          <div>
            <span className="block text-gray-600 text-xs uppercase">Check-Out</span>
            <span className="block font-bold -mb-1 text-emerald-700 text-2xl">{checkoutDate}</span>
            <span className="block text-emerald-700 text-sm">{checkoutTime}</span>
            <span className="block text-gray-600 text-[0.625rem]">{timezoneName}</span>
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
