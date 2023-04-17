import PageTitle from '@/components/PageTitle';
import TripForm from '@/components/TripForm';

export default function AddTrip() {
  return (
    <div className="mx-auto max-w-screen-sm">
      <header className="mb-6">
        <PageTitle>New Trip</PageTitle>
      </header>

      <TripForm />
    </div>
  );
}
