import useSWR from 'swr';

function fetchWithToken(url, token) {

  const fetcher = async (url, token) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
   
    return res.json();
  };

  const { data, error, isLoading } = useSWR([url, token], ([url, token]) => fetcher(url, token));

  return { data, error, isLoading };
}

export { fetchWithToken };
