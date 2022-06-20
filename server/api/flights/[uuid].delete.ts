import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  try {
    await prisma.flight.delete({
      where: {
        uuid: event.context.params.uuid,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  return event.res.statusCode = 204;
});
