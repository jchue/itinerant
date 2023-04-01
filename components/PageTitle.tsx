export default function PageTitle({ children, addClass }) {
  return (
    <h1 className={`leading-none text-[2.5rem] uppercase ${addClass}`}>
      {children}
    </h1>
  );
}
