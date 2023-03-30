import { useRouter } from 'next/router';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function EditStay() {
  const router = useRouter();

  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/stays/${router.query.uuid}`, session?.access_token);

  let tripUuid,
  name,
  address,
  latitude,
  longitude,
  confirmationNumber,
  checkinTimestamp,
  checkoutTimestamp,
  timezoneName;

  if (data) {
    ({ tripUuid,
      name,
      address,
      latitude,
      longitude,
      confirmationNumber,
      checkinTimestamp,
      checkoutTimestamp,
      timezoneName } = data);
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
        <Link
          href={`/stays/${router.query.uuid}`}
          className="text-gray-300 text-sm uppercase hover:text-gray-400"
        >
          &larr; Back
        </Link>

        <PageTitle>Edit Stay</PageTitle>
      </header>

      <StayForm
        stayUuid={router.query.uuid}
        initialTripUuid={tripUuid}
        initialName={name}
        initialAddress={address}
        initialLatitude={latitude}
        initialLongitude={longitude}
        initialConfirmationNumber={confirmationNumber}
        initialCheckinTimestamp={checkinTimestamp}
        initialCheckoutTimestamp={checkoutTimestamp}
        initialTimezoneName={timezoneName}
      />
    </>
  );
}