import useSWR from 'swr';

function useApiWithToken(url: string, token: string) {

  const fetcher = async (url: string, token: string) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');

      console.error(res.status);
      console.error(await res.json());
      
      throw error;
    }
   
    return res.json();
  };

  const { data, error, isLoading } = useSWR([url, token], ([url, token]) => fetcher(url, token));

  return { data, error, isLoading };
}

export { useApiWithToken };
