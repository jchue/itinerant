import { useRouter } from 'next/router';
import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import Loader from '@/components/Loader';
import NotFound from '@/components/NotFound';
import PageTitle from '@/components/PageTitle';
import TripForm from '@/components/TripForm';

export default function EditTrip() {
  const router = useRouter();

  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken(`/api/trips/${router.query.uuid}`, session?.access_token);

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
        <Link href={`/trips/${router.query.uuid}`} className="inline-block mb-4 text-gray-500 text-sm uppercase hover:text-gray-600">
          &larr; Back
        </Link>

        <PageTitle>Edit Trip</PageTitle>
      </header>

      <TripForm tripUuid={router.query.uuid} initialName={data.name} initialDestination={data.destination} />
    </div>
  );
}