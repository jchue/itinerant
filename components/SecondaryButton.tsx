export default function SecondaryButton({ children, addClass, onClick, title, type, inverted }) {
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
