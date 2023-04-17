import { ReactNode } from 'react';

export default function SecondaryButton({ children, addClass, onClick, title, type = 'button', inverted }: { children: ReactNode, addClass?: string, onClick?: any, title?: string, type?: 'button' | 'submit' | 'reset', inverted?: boolean }) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className={`font-bold inline-flex justify-center py-2 px-3 border text-xs transition-shadow uppercase hover:shadow-glow focus:outline-none ${inverted ? `border-white text-white hover:shadow-white/25` : `border-emerald-700 text-emerald-700 hover:shadow-emerald-700/25`} ${addClass}`}
    >
     {children}
    </button>
  );
}
