import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import TripForm from '@/components/TripForm';

export default function AddTrip() {
  return (
    <div>
      <header className="mb-6">
        <Link href="trips" className="text-gray-300 text-sm uppercase hover:text-gray-400">
          &larr; Back
        </Link>

        <PageTitle>New Trip</PageTitle>
      </header>

      <TripForm />
    </div>
  );
}