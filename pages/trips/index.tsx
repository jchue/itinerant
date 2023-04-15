import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Link from 'next/link';
import Loader from '@/components/Loader';
import PageTitle from '@/components/PageTitle';
import SecondaryButton from '@/components/SecondaryButton';
import TripCard from '@/components/TripCard';
import 'material-symbols';

export default function Trips() {
  const session = supabase.auth.session();

  const { data, error, isLoading } = useApiWithToken('/api/trips', session?.access_token);

  return (
    <>
      <header className="mb-6">
        <PageTitle addClass="align-middle inline-block mr-6">Trips</PageTitle>

        <Link href="/addtrip">
          <SecondaryButton addClass="align-middle flex inline-block items-center pr-5">
            <span className="!leading-none material-symbols-sharp !text-lg">add</span>
            New
          </SecondaryButton>
        </Link>
      </header>

      <main>
        {isLoading ? (
          <Loader />
        ) : data.length === 0 ? (
          /* Blank state */
          <div className="p-6 rounded-lg text-center text-gray-500">
            <span className="material-symbols-sharp pr-2 !text-[200px] text-gray-200">map</span>

            <p className="mb-4">Nothing to see here yet.</p>

            <Link href="/addtrip">
              <button type="button">
                <span className="material-symbols-sharp pr-2 !text-xl text-white">add</span>
                <span className="mt-1">New Trip</span>
              </button>
            </Link>
          </div>
        ) : (
          /* Trips list */
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((trip) => (
              <li key={trip.uuid}>
                <Link href={`/trips/${trip.uuid}`}>
                  <TripCard
                    name={trip.name}
                    destination={trip.destination}
                    image={trip.image}
                    start={trip.start}
                    end={trip.end}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
