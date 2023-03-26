import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import tripRange from '@/lib/tripRange';

export default function TripSelect({ value, onChange }) {
  // Get current session
  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken('/api/trips', session?.access_token);

  function displayRange(dateRange) {
    return dateRange ? `(${dateRange})` : '';
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }
  return (
    <div>
      <select
        value={value}
        onChange={onChange}
        className="bg-gray-200 border-2 outline-none p-2 rounded-md text-gray-700 text-sm w-full"
        required
      >
        {data.map((trip) => (
          <option key={trip.uuid} value={trip.uuid}>
            {trip.name} {displayRange(tripRange(trip.start, trip.end))}
          </option>
        ))}
      </select>
    </div>
  );
}
