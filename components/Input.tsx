export default function Input({ value, onChange, addClass, label, type = 'text', size = 20, disabled = false, required = false }: { value?: string, onChange: any, addClass?: string, label: string, type?: string, size?: number, disabled?: boolean, required?: boolean }) {
  return (
    <div className={addClass}>
      <label className="block mb-1 text-xs uppercase">{label}</label>
      <input
        type={type}
        size={size}
        value={value}
        onChange={onChange}
        className={`bg-gray-200 border-2 border-gray-200 outline-none p-2 rounded-md
        text-gray-700 text-sm w-full disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400
        focus:border-emerald-400`}
        disabled={disabled}
        required={required} />
    </div>
  );
}
