import deleteStay from '@/lib/deleteStay';
import getStay from '@/lib/getStay';
import writeStay from '@/lib/writeStay';
import { NextApiRequest, NextApiResponse } from 'next';
import HTTPError from '@/lib/error';

export default async function hander(req: NextApiRequest, res: NextApiResponse) {
  const userId = typeof req.headers.userid === 'object' ? req.headers.userid[0] : req.headers.userid || '';
  let uuid = req.query.uuid ? req.query.uuid[0] : null;

  try {
    if (req.method === 'GET') {
      /**
       * GET /stays/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const stay = await getStay(userId, uuid);

      if (!stay) throw new HTTPError(404, 'Not Found');

      return res.status(200).json(stay);
    }

    if (req.method === 'POST') {
      /**
       * POST /stays
       */

      if (uuid) throw new HTTPError(405, 'Method Not Allowed');

      const stay = await writeStay(userId, { ...req.body });

      return res.status(201).json(stay)
    }

    if (req.method === 'PUT') {
      /**
       * PUT /stays/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const trip = await writeStay(userId, { uuid, ...req.body });

      if (!trip) throw new HTTPError(404, 'Not Found');

      return res.status(204).send(null);
    }

    if (req.method === 'DELETE') {
      /**
       * DELETE /stays/[uuid]
       */

      if (!uuid) throw new HTTPError(405, 'Method Not Allowed');

      const stay = await deleteStay(userId, { uuid });

      if (!stay) throw new HTTPError(404, 'Not Found');

      return res.status(204).send(null);
    }
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}