import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-symbols';

export default function StayCard({ type, name, timestamp, timezoneName }) {
  const prefix = type === 'checkin' ? 'Check-In' : type === 'checkout' ? 'Check-Out' : '';
  const time = format(utcToZonedTime(timestamp, timezoneName), 'p');

  return (
    <div className="flex items-center p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
      <div className="flex-1">
        <div className="text-gray-600 text-xs uppercase">
          {prefix}
        </div>
        <div className="font-bold mr-4 text-emerald-700 text-2xl">
          {time}
        </div>
        <div className="-mt-1 text-gray-600 text-[0.625rem]">
          {timezoneName}
        </div>
        <div className="font-light mt-6 text-emerald-700 text-xl">
          {name}
        </div>
      </div>

      <div className="flex-none text-center w-20">
        <span className="material-symbols-sharp !text-4xl text-emerald-700">bed</span>
      </div>
    </div>
  );
}
