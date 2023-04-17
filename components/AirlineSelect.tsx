import { useApiWithToken } from '@/lib/fetcher';
import supabase from '@/lib/supabase';
import { Airline } from '@prisma/client';
import CustomAsyncSelect from './CustomAsyncSelect';

export default function AirlineSelect({ label, value, onChange, addClass }: { label: string, value?: Airline, onChange: any, addClass?: string }) {
  // Get current session
  const session = supabase.auth.session();
  
  const { data: airlines, error, isLoading } = useApiWithToken('/api/airlines', session?.access_token || '');

  function filterAirlines(query: string) {
    const filtered = airlines.filter((airline: Airline) => {
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
      getOptionLabel={(airline: Airline) => `${airline.name} (${airline.code})`}
      getOptionValue={(airline: Airline) => airline.code}
      addClass={addClass}
      label={label}
    />
  );
}
