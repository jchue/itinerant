import { useRouter } from 'next/router';
import Link from 'next/link';
import FlightForm from '@/components/FlightForm';
import PageTitle from '@/components/PageTitle';

export default function AddFlight() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>New Flight</PageTitle>
      </header>

      <FlightForm initialTripUuid={router.query.uuid} />
    </div>
  );
}
