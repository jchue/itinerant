import { ReactNode } from 'react';

export default function PrimaryButton({ children, addClass, onClick, type = 'button' }: { children: ReactNode, addClass?: string, onClick?: React.MouseEventHandler<HTMLButtonElement>, type?: 'button' | 'submit' | 'reset' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-emerald-700 font-bold inline-flex justify-center py-3 px-6 border border-transparent
      shadow-glow shadow-emerald-700 text-xs text-white transition uppercase hover:bg-emerald-600 hover:shadow-glow-lg hover:shadow-emerald-700
      focus:outline-none ${addClass}`}
    >
      {children}
    </button>
  );
}
