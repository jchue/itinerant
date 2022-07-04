import { createError, sendError } from 'h3';
import { prismaClient, Prisma } from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  const airlineInfo = Prisma.validator<Prisma.AirlineSelect>()({
    code: true,
    name: true,
  });

  try {
    const airlines = await prismaClient.airline.findMany({
      select: airlineInfo,
    });

    return airlines.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }
});
