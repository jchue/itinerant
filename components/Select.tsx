import { ReactNode } from 'react';

export default function Select({ children, value, onChange, addClass, label, disabled = false, required = false }: { children: ReactNode, value: any, onChange: any, addClass?: string, label: string, disabled?: boolean, required?: boolean }) {
  return (
    <div>
      <label className="block mb-1 text-xs uppercase">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`bg-gray-200 border-2 outline-none p-2 rounded-md text-gray-700 text-sm w-full disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400 ${addClass}`}
        disabled={disabled}
        required={required}
      >
        {children}
      </select>
    </div>
  );
}
