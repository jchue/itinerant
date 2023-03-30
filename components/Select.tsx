export default function Select({ children, value, onChange, addClass, label, disabled = false, required = false }) {
  return (
    <div>
      <label className="block font-bold mb-1 text-xs uppercase">{label}</label>
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
