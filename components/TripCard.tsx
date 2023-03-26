import tripRange from '@/lib/tripRange';

export default function TripCard({ name, start, end }) {
  return (
    <div
      className="block cursor-pointer font-sans my-4 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <span className="block font-bold uppercase">{name}</span>
      <span className="block text-gray-600 text-sm">{tripRange(start, end)}</span>
    </div>
  );
}
