import tripRange from '@/lib/tripRange';
import { DateTime } from '@/additional';
import Image from 'next/image';
import 'material-symbols';

export default function TripCard({ name, destination, image, start, end }: { name: string, destination: string | null, image: string | null, start?: DateTime, end?: DateTime}) {
  return (
    <div
      className="block cursor-pointer font-sans rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <div className="relative h-56 rounded-t-lg">
        {image ? (
          <Image
            src={`${image}&q=85&h=250&fm=jpg&fit=max&crop=entropy`}
            alt=""
            fill
            style={{objectFit:"cover"}}
            className="rounded-t-lg"
            quality="80"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="material-symbols-sharp !text-[120px] text-gray-300">location_city</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="block font-bold uppercase">{name}</span>
        <span className="block mb-2 text-xs">{destination}</span>
        <span className="block text-gray-600 text-sm">{tripRange(start, end)}</span>
      </div>
    </div>
  );
}
