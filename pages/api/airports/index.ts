import { prismaClient, Prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const airportInfo = Prisma.validator<Prisma.AirportSelect>()({
    code: true,
    name: true,
    latitude: true,
    longitude: true,
  });

  try {
    const airports = await prismaClient.airport.findMany({
      select: airportInfo,
    });

    return res.status(200).send(airports);
  } catch (error) {
    console.error(error);

    return res.status(500).send('Internal Server Error');
  }
}
