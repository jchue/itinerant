import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import TripForm from '@/components/TripForm';

export default function AddTrip() {
  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <Link href="trips" className="inline-block mb-4 text-gray-500 text-sm uppercase hover:text-gray-600">
          &larr; Back
        </Link>

        <PageTitle>New Trip</PageTitle>
      </header>

      <TripForm />
    </div>
  );
}