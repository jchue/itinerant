import { useRouter } from 'next/router';
import Link from 'next/link';
import FlightForm from '@/components/FlightForm';
import PageTitle from '@/components/PageTitle';

export default function AddFlight() {
  const router = useRouter();

  return (
    <>
      <header className="mb-6">
        <Link
          href={`/trips/${router.query.uuid}`}
          className="text-gray-300 text-sm uppercase hover:text-gray-400"
        >
          &larr; Back
        </Link>

        <PageTitle>New Flight</PageTitle>
      </header>

      <FlightForm initialTripUuid={router.query.uuid} />
    </>
  );
}
