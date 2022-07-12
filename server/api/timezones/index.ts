import { find } from 'geo-tz';
import tzData from '~/node_modules/geo-tz/data/index.json';

export default defineEventHandler((event) => {
  /**
   * If latitude and longitude are received, find specific timezone
   */

  const query = useQuery(event);

  const latitude: number = Number(query.lat);
  const longitude: number = Number(query.lon);

  if (latitude && longitude) {
    return find(latitude, longitude);
  }

  /**
   * Otherwise, return full list
   * Required only for server-side validation of received timezones
   */

  const { timezones } = tzData;

  return timezones;
});
