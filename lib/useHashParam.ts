import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Parameter {
  [key: string]: string
}

export function useHashParam(): Parameter {
  const router = useRouter();
  const [hashParam, setHashParam] = useState<Parameter>({});

  useEffect(() => {
    const query = router.asPath.split('#')[1];

    if (!query) return setHashParam({});

    const params = query.split('&');

    const parsed: { [key: string]: string } = {};
    params.forEach((param) => {
      const parsedParam = param.split('=');

      // Replace all + with spaces
      const regex = /\++/g;

      const key: string = parsedParam[0].replace(regex, ' ');
      const value: string = parsedParam[1] ? parsedParam[1].replace(regex, ' ') : '';

      parsed[key] = value;
    });

    setHashParam(parsed);
  }, []);

  return hashParam;
}
