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
    const airport = await prismaClient.airport.findUnique({
      where: {
        code: event.context.params.code,
      },
      select: airportInfo,
      rejectOnNotFound: true,
    });

    return airport;
  } catch (error) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return null;
  }
});
