import { createError, sendError } from 'h3';
import prisma from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  let airport = null;
  try {
    airport = await prisma.airport.findUnique({
      where: {
        code: event.context.params.code,
      },
      select: {
        code: true,
        name: true,
        latitude: true,
        longitude: true,
      },
      rejectOnNotFound: true,
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return;
  }

  return airport;
});
