import { useRouter } from 'next/router';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function AddStay() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <Link
          href={`/trips/${router.query.uuid}`}
          className="inline-block mb-4 text-gray-500 text-sm uppercase hover:text-gray-600"
        >
          &larr; Back
        </Link>

        <PageTitle>New Stay</PageTitle>
      </header>

      <StayForm initialTripUuid={router.query.uuid} />
    </div>
  );
}
