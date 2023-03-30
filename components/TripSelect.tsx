import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import tripRange from '@/lib/tripRange';
import Select from './Select';

export default function TripSelect({ label, value, onChange, addClass }) {
  // Get current session
  const session = supabase.auth.session();

  const { data, error, isLoading } = fetchWithToken('/api/trips', session?.access_token);

  function displayRange(dateRange) {
    return dateRange ? `(${dateRange})` : '';
  }

  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      addClass={addClass}
      disabled={isLoading}
      required
    >
      {isLoading ? (
        <option>Loading...</option>
      ) : (
        data.map((trip) => (
          <option key={trip.uuid} value={trip.uuid}>
            {trip.name} {displayRange(tripRange(trip.start, trip.end))}
          </option>
        ))
      )}
    </Select>
  );
}
