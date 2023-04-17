import { find } from 'geo-tz';
import tzData from 'geo-tz/data/index.json';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * If latitude and longitude are received, find specific timezone
   */

  const latitude: number = Number(req.query.lat);
  const longitude: number = Number(req.query.lon);

  if (latitude && longitude) {
    return res.status(200).send(find(latitude, longitude));
  }

  /**
   * Otherwise, return full list
   * Required only for server-side validation of received timezones
   */

  const { timezones } = tzData;

  return res.status(200).send(timezones);
}
