import SectionTag from './SectionTag';

export default function Legend({ children, addClass }) {
  return (
    <legend className={`block relative text-center w-full ${addClass}`}>
      <span className="bg-white font-bold px-4 text-emerald-700 text-xs uppercase">{children}</span>
      <span className="block bg-emerald-700 h-[1px] absolute inset-x-0 inset-y-1/2 -z-10"></span>
    </legend>
  );
}
