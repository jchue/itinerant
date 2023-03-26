import HTTPError from '@/lib/error';
import getTrips from '@/lib/getTrips';
import deleteTrip from '@/lib/deleteTrip';
import getTrip from '@/lib/getTrip';
import writeTrip from '@/lib/writeTrip';

export default async function handler(req, res) {
  const userId = req.headers.userid;
  const uuid = req.query.uuid ? req.query.uuid[0] : null;

  try {
    if (req.method === 'GET') {
      if (uuid){
        /**
         * GET /trips/[uuid]
         */

        const trip = await getTrip(userId, uuid);

        if (!trip) return res.status(404).send('Not Found');

        return res.status(200).json(trip);
      }

      /**
       * GET /trips
       */

      const trips = await getTrips(userId);

      return res.status(200).json(trips);
    }
    
    if (req.method === 'POST' || req.method === 'PUT') {
      if (req.method === 'POST') {
        /**
         * POST /trips
         */

        if (uuid) throw new HTTPError(405, 'Method Not Allowed');

        const trip = await writeTrip(userId, { ...req.body });

        return res.status(201).json(trip);
      }

      if (req.method === 'PUT') {
        /**
         * PUT /trips/[uuid]
         */

        if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

        const trip = await writeTrip(userId, { uuid, ...req.body });

        if (!trip) throw new HTTPError(404, 'Not Found');

        return res.status(204).send();
        }
      }

      if (req.method === 'DELETE') {
        /**
         * DELETE /trips/[uuid]
         */

        if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

        const trip = await deleteTrip(userId, { uuid });

        if (!trip) throw new HTTPError(404, 'Not Found');

        return res.status(204).send();
      }
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}