export default function SectionTag({ children, addClass }) {
  return (
    <div className={`bg-emerald-700 font-bold inline-block px-4 py-2 rounded-md text-white text-xs uppercase ${addClass}`}>
      {children}
    </div>
  );
}
