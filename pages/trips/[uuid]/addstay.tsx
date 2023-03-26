import { useRouter } from 'next/router';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import StayForm from '@/components/StayForm';

export default function AddStay() {
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

        <PageTitle>New Stay</PageTitle>
      </header>

      <StayForm initialTripUuid={router.query.uuid} />
    </>
  );
}
