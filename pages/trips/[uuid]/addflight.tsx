import { useRouter } from 'next/router';
import FlightForm from '@/components/FlightForm';
import PageTitle from '@/components/PageTitle';

export default function AddFlight() {
  const router = useRouter();
  const tripUuid = typeof router.query.uuid === 'object' ? router.query.uuid[0] : router.query.uuid || '';

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>New Flight</PageTitle>
      </header>

      <FlightForm initialTripUuid={tripUuid} />
    </div>
  );
}
