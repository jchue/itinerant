import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import Select from './Select';

export default function AirportSelect({ label, value, onChange, addClass }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airports, error, isLoading } = fetchWithToken('/api/airports', session?.access_token);

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

          {airports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.code} - {airport.name}
            </option>
          ))}
        </>
      )}
    </Select>
  );
}
