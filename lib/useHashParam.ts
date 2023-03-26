import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useHashParam() {
  const router = useRouter();
  const [hashParam, setHashParam] = useState();

  useEffect(() => {
    const query = router.asPath.split('#')[1];

    if (!query) return setHashParam({});

    const params = query.split('&');

    const parsed = {};
    params.forEach((param) => {
      const parsedParam = param.split('=');

      // Replace all + with spaces
      const regex = /\++/g;

      const key = parsedParam[0].replace(regex, ' ');
      const value = parsedParam[1] ? parsedParam[1].replace(regex, ' ') : '';

      parsed[key] = value;
    });

    setHashParam(parsed);
  }, []);

  return hashParam;
}
