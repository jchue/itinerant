import { useRouter } from 'next/router';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function AddStay() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>New Stay</PageTitle>
      </header>

      <StayForm initialTripUuid={router.query.uuid} />
    </div>
  );
}
