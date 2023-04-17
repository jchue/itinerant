import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import { Airport } from '@prisma/client';
import CustomAsyncSelect from './CustomAsyncSelect';

export default function AirportSelect({ label, value, onChange, addClass }: { label: string, value?: Airport, onChange: any, addClass: string }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airports, error, isLoading } = useApiWithToken('/api/airports', session?.access_token || '');

  function promiseOptions(inputValue: string) {
    return new Promise((resolve) => {
      const filtered = airports.filter((airport: Airport) => {
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

  function filterAirports(query: string) {
    const filtered = airports.filter((airport: Airport) => {
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
      getOptionLabel={(airport: Airport) => `${airport.code} - ${airport.name}`}
      getOptionValue={(airport: Airport) => airport.code}
    />
  );
}
