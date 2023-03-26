import HTTPError from '@/lib/error';
import deleteFlight from '@/lib/deleteFlight';
import getFlight from '@/lib/getFlight';
import writeFlight from '@/lib/writeFlight';

export default async function hander(req, res) {
  const userId = req.headers.userid;
  let uuid = req.query.uuid ? req.query.uuid[0] : null;

  try {
    if (req.method === 'GET') {
      /**
       * GET /flights/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const flight = await getFlight(userId, uuid);

      if (!flight) throw new HTTPError(404, 'Not Found');

      return res.status(200).json(flight);
    }

    if (req.method === 'POST') {
      /**
       * POST /flights
       */

      if (uuid) throw new HTTPError(405, 'Method Not Allowed');

      const flight = await writeFlight(userId, { ...req.body });

      return res.status(201).json(flight)
    }

    if (req.method === 'PUT') {
      /**
       * PUT /flights/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const trip = await writeFlight(userId, { uuid, ...req.body });

      if (!trip) throw new HTTPError(404, 'Not Found');

      return res.status(204).send();
    }

    if (req.method === 'DELETE') {
      /**
       * DELETE /flights/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const flight = await deleteFlight(userId, { uuid });

      if (!flight) throw new HTTPError(404, 'Not Found');

      return res.status(204).send();
    }
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}
