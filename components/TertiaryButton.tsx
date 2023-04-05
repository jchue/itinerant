export default function TertiaryButton({ children, addClass, onClick, title, type = 'button' }) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className={`font-bold inline-flex justify-center py-3 px-6 text-emerald-700 text-xs transition-shadow uppercase hover:text-emerald-500 focus:outline-none ${addClass}`}
    >
     {children}
    </button>
  );
}
