import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import { DateTime } from '@/additional';

function formatDate(timestamp: Date, timezoneName: string) {
  return format(utcToZonedTime(timestamp, timezoneName), 'MMM do');
}

export default function tripRange(start?: DateTime, end?: DateTime): string {
  if (start && end) {
    const startDate = formatDate(start.timestamp, start.timezoneName);
    const endDate = formatDate(end.timestamp, end.timezoneName);

    if (startDate === endDate) {
      // If both dates are the same, only return one
      return `${startDate}`;
    }

    // If dates are different, return range
    return `${startDate} - ${endDate}`;
  }

  // Otherwise return one date or none at all
  if (start) {
    const startDate = formatDate(start.timestamp, start.timezoneName);

    return `${startDate}`;
  }

  if (end) {
    const endDate = formatDate(end.timestamp, end.timezoneName);

    return `${endDate}`;
  }

  return '';
}
