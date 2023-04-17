import { ReactNode } from 'react';

export default function PageTitle({ children, addClass }: { children: ReactNode, addClass?: string }) {
  return (
    <h1 className={`leading-none text-[2.5rem] uppercase ${addClass}`}>
      {children}
    </h1>
  );
}
