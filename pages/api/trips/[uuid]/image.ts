import axios from 'axios';
import { prismaClient } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import HTTPError from '@/lib/error';

/**
 * Random image parameters
 */

const imgSet = 25;
const orientation = 'landscape';
const size = 'raw';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = typeof req.headers.userid === 'object' ? req.headers.userid[0] : req.headers.userid || '';
  const uuid = typeof req.query.uuid === 'object' ? req.query.uuid[0] : req.query.uuid || '';

  try {
    /**
     * Get trip destination
     */

    let destination = '';

    try {
      /**
       * Using findFirst() to be able to enforce user ID,
       * enforced on trip and event levels
       * UUID currently has UNIQUE constraint in DB,
       * so can change if performance becomes detrimental
       */
      const tripData = await prismaClient.trip.findFirst({
        where: {
          uuid,
          userId,
        },
        select: {
          uuid: true,
          destination: true,
        },
      });

      destination = tripData?.destination || '';
    } catch (error) {
      throw new HTTPError(404, 'Not Found');
    }

    /**
     * Get random image
     */

    const imgIndex = Math.floor(Math.random() * imgSet);
    let image = '';

    try {
      const imgApi = `https://api.unsplash.com/search/photos?${orientation ? `orientation=${orientation}&` : ''}page=1&per_page=${imgSet}&query=city ${destination}`;

      console.log(imgApi);

      const { data } = await axios({
        url: imgApi,
        method: 'get',
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });

      image = data.results[imgIndex].urls[size];
    } catch (error: any) {
      throw error.cause || error.response.data;
    }

    /**
     * Update trip
     */

    // Using updateMany() to be able to enforce user ID
    const trip = await prismaClient.trip.updateMany({
      where: {
        uuid,
        userId,
      },
      data: {
        imageUrl: image,
      },
    });

    if (!trip.count) throw new Error();

    return res.status(200).json({
      uuid,
      image,
    });
  } catch (error) {
    console.error(error);

    // Only show error details if HTTPError
    if (error instanceof HTTPError) return res.status(error.code|| 500).send(error.message || 'Internal Server Error');
    return res.status(500).send('Internal Server Error');
  }
}