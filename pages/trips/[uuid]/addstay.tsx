import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function AddStay() {
  const router = useRouter();
  const tripUuid = typeof router.query.uuid === 'object' ? router.query.uuid[0] : router.query.uuid || '';

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>New Stay</PageTitle>
      </header>

      <StayForm initialTripUuid={tripUuid} />
    </div>
  );
}
