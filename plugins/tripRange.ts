import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

export default defineNuxtPlugin((nuxtApp) => {
  function formatDate(timestamp, timezoneName) {
    return format(utcToZonedTime(timestamp, timezoneName), 'MMM do');
  }

  function range(start, end) {
    if (start && end) {
      const startDate = formatDate(start.timestamp, start.timezoneName);
      const endDate = formatDate(end.timestamp, end.timezoneName);

      if (startDate === endDate) {
        // If both dates are the same, only return one
        return `${startDate}`;
      } else {
        // If dates are different, return range
        return `${startDate} - ${endDate}`;
      }
    } else {
      // If return one date or none at all
      if (start) {
        const startDate = formatDate(start.timestamp, start.timezoneName);

        return `${startDate}`;
      } else if (end) {
        const endDate = formatDate(end.timestamp, end.timezoneName);

        return `${endDate}`;
      }

      return null;
    }
  }

  return {
    provide: {
      tripRange: range,
    },
  };
});
