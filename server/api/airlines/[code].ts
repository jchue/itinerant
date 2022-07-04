import { createError, sendError } from 'h3';
import { prismaClient, Prisma } from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  const airlineInfo = Prisma.validator<Prisma.AirlineSelect>()({
    code: true,
    name: true,
  });

  try {
    const airline = await prismaClient.airline.findUnique({
      where: {
        code: event.context.params.code,
      },
      select: airlineInfo,
      rejectOnNotFound: true,
    });

    return airline;
  } catch (error) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return null;
  }
});
