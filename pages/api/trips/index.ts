import getTrips from '@/lib/getTrips';
import writeTrip from '@/lib/writeTrip';
import { NextApiRequest, NextApiResponse } from 'next';
import HTTPError from '@/lib/error';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = typeof req.headers.userid === 'object' ? req.headers.userid[0] : req.headers.userid || '';

  try {
    if (req.method === 'GET') {
      /**
       * GET /trips
       */

      const trips = await getTrips(userId);

      return res.status(200).json(trips);
    }

    if (req.method === 'POST') {
      /**
       * POST /trips
       */

      const trip = await writeTrip(userId, { ...req.body });

      return res.status(201).json(trip);
    }
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}
