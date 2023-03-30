import { fetchWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import CustomAsyncSelect from './CustomAsyncSelect';

export default function AirportSelect({ label, value, onChange, addClass }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airports, error, isLoading } = fetchWithToken('/api/airports', session?.access_token);

  function promiseOptions(inputValue) {
    return new Promise((resolve) => {
      const filtered = airports.filter((airport) => {
        if (
          airport.name.toLowerCase().includes(inputValue.toLowerCase())
          || airport.code.toLowerCase().includes(inputValue.toLowerCase())
          || `${airport.code.toLowerCase()} - ${airport.name.toLowerCase()}`.includes(inputValue.toLowerCase())
        ) {
          return true;
        }
        return false;
      });
      resolve(filtered);
    });
  }

  function filterAirports(query) {
    const filtered = airports.filter((airport) => {
      if (
        airport.name.toLowerCase().includes(query.toLowerCase())
        || airport.code.toLowerCase().includes(query.toLowerCase())
        || `${airport.code.toLowerCase()} - ${airport.name.toLowerCase()}`.includes(query.toLowerCase())
      ) {
        return true;
      }
      return false;
    });

    return filtered;
  }

  return (
    <CustomAsyncSelect
      label={label}
      value={value}
      onChange={onChange}
      addClass={addClass}
      isLoading={isLoading}
      filterFn={filterAirports}
      getOptionLabel={airport => `${airport.code} - ${airport.name}`}
      getOptionValue={airport => airport.code}
    />
  );
}
