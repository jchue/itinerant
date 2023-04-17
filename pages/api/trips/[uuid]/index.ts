import deleteTrip from '@/lib/deleteTrip';
import getTrip from '@/lib/getTrip';
import writeTrip from '@/lib/writeTrip';
import { NextApiRequest, NextApiResponse } from 'next';
import HTTPError from '@/lib/error';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = typeof req.headers.userid === 'object' ? req.headers.userid[0] : req.headers.userid || '';
  const uuid = typeof req.query.uuid === 'object' ? req.query.uuid[0] : req.query.uuid || '';

  try {
    if (req.method === 'GET') {
      /**
       * GET /trips/[uuid]
       */

      const trip = await getTrip(userId, uuid);

      if (!trip) return res.status(404).send('Not Found');

      return res.status(200).json(trip);
    }

    if (req.method === 'PUT') {
      /**
       * PUT /trips/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const trip = await writeTrip(userId, { uuid, ...req.body });

      if (!trip) throw new HTTPError(404, 'Not Found');

      return res.status(204).send(null);
    }

    if (req.method === 'DELETE') {
      /**
       * DELETE /trips/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const trip = await deleteTrip(userId, { uuid });

      if (!trip) throw new HTTPError(404, 'Not Found');

      return res.status(204).send(null);
    }
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}
