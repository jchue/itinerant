import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-symbols';

export default function FlightCard({ airline, flightNumber, departureAirport, departureTimestamp, departureTimezoneName, arrivalAirport, arrivalTimestamp, arrivalTimezoneName }) {
  const departureDate = format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'yyyy-MM-dd');
  const departureTime = format(utcToZonedTime(departureTimestamp, departureTimezoneName), 'p');
  const arrivalDate = format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'yyyy-MM-dd');
  const arrivalTime = format(utcToZonedTime(arrivalTimestamp, arrivalTimezoneName), 'p');
  const duration = intervalToDuration({
    start: new Date(departureTimestamp),
    end: new Date(arrivalTimestamp),
  });
  const delimiter = (function() {
    if (
      (airline || flightNumber)
      && (duration.years || duration.months || duration.days
        || duration.hours || duration.minutes || duration.seconds)
    ) {
      return '|';
    }
    return null;
  })();

  return (
    <div className="flex items-center p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
      <div className="flex-1">
        {/* Depart/Arrive */}
        <div className="flex">
          {/* Depart */}
          <div className="mr-10 shrink">
            <div className="text-gray-600 text-xs uppercase">Depart</div>
            <div className="text-2xl">
              <span className="font-bold mr-4 text-emerald-700">{departureTime}</span>
              <span className="font-light text-gray-600">{departureAirport}</span>
            </div>
            <div className="font-light -mt-1 text-gray-500 text-[0.625rem]">{departureTimezoneName}</div>
          </div>

          {/* Arrive */}
          <div className="shrink">
            <div className="text-gray-600 text-xs uppercase">Arrive</div>
            <div className="text-2xl">
              <span className="font-bold mr-4 text-emerald-700">{arrivalTime}</span>
              <span className="font-light text-gray-600">{arrivalAirport}</span>
            </div>
            <div className="font-light -mt-1 text-gray-500 text-[0.625rem]">{arrivalTimezoneName}</div>
          </div>
        </div>

        {/* Flight Name */}
        <div className="font-light mt-6 text-emerald-700 text-xl">
          {airline && `${airline.name} ${airline.code}`} {flightNumber} {delimiter} {(duration.years > 0) && duration.years + 'y'} {(duration.months > 0) && duration.months + 'm'} {(duration.days > 0) && duration.days + 'd'} {(duration.hours > 0 ) && duration.hours + 'h'} {(duration.minutes > 0) && duration.minutes + 'm'}
        </div>
      </div>
      <div className="flex-none text-center w-20">
          <span className="material-symbols-sharp !text-4xl text-emerald-700">flight</span>
        </div>
    </div>
  );
}
