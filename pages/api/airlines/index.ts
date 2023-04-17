import { prismaClient, Prisma } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const airlineInfo = Prisma.validator<Prisma.AirlineSelect>()({
    code: true,
    name: true,
  });

  try {
    const airlines = await prismaClient.airline.findMany({
      select: airlineInfo,
    });

    return res.status(200).send(airlines.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    }));
  } catch (error) {
    console.error(error);

    return res.status(500).send('Internal Server Error');
  }
}
