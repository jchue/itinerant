export default function PageTitle({ children, addClass }) {
  return (
    <h1 className={`text-[2.5rem] uppercase ${addClass}`}>
      {children}
    </h1>
  );
}
