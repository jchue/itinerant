import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import CustomAsyncSelect from './CustomAsyncSelect';

export default function AirlineSelect({ label, value, onChange, addClass }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airlines, error, isLoading } = fetchWithToken('/api/airlines', session?.access_token);

  function filterAirlines(query) {
    const filtered = airlines.filter((airline) => {
        if ( airline.name.toLowerCase().includes(query.toLowerCase())
        || airline.code.toLowerCase().includes(query.toLowerCase())) {
          return true;
        }
        return false;
    });

    return filtered;
  }

  return (
    <CustomAsyncSelect
      value={value}
      isLoading={isLoading}
      onChange={onChange}
      filterFn={filterAirlines}
      getOptionLabel={airline => `${airline.name} (${airline.code})`}
      getOptionValue={airline => airline.code}
      addClass={addClass}
      label={label}
    />
  );
}
