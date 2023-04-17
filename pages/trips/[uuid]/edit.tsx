import { useRouter } from 'next/router';
import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import TripForm from '@/components/TripForm';

export default function EditTrip() {
  const router = useRouter();
  const tripUuid = typeof router.query.uuid === 'object' ? router.query.uuid[0] : router.query.uuid || '';

  const session = supabase.auth.session();

  const { data, error, isLoading } = useApiWithToken(`/api/trips/${router.query.uuid}`, session?.access_token || '');

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
        <PageTitle>Edit Trip</PageTitle>
      </header>

      <TripForm tripUuid={tripUuid} initialName={data.name} initialDestination={data.destination} />
    </div>
  );
}
