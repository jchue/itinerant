import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Select from './Select';

export default function AirlineSelect({ label, value, onChange, addClass }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airlines, error, isLoading } = fetchWithToken('/api/airlines', session?.access_token);

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
        <>
          <option value=''></option>

          {airlines.map((airline) => (
            <option key={airline.code} value={airline.code}>
              {airline.name} ({airline.code})
            </option>
          ))}
        </>
      )}
    </Select>
  );
}
