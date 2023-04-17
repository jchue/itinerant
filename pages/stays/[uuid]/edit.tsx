import { useRouter } from 'next/router';
import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function EditStay() {
  const router = useRouter();
  const stayUuid = typeof router.query.uuid === 'object' ? router.query.uuid[0] : router.query.uuid || '';

  const session = supabase.auth.session();

  const { data, error, isLoading } = useApiWithToken(`/api/stays/${router.query.uuid}`, session?.access_token || '');

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
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>Edit Stay</PageTitle>
      </header>

      <StayForm
        stayUuid={stayUuid}
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
    </div>
  );
}
