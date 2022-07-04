import { createError, sendError } from 'h3';
import { prismaClient, Prisma } from '@/server/utils/db';

export default defineEventHandler(async (event) => {
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

    return airports;
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }
});
