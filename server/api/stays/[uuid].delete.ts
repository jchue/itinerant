import { createError, sendError } from 'h3';
import { prismaClient, Prisma } from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  // Require auth
  if (event.context.auth.error) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    }));

    return null;
  }

  const userId: string = event.context.auth.user.id;

  try {
    // Using deleteMany() to be able to enforce user ID
    const response = await prismaClient.stay.deleteMany({
      where: {
        uuid: event.context.params.uuid,
        userId,
      },
    });

    // If no records updated, most likely invalid params
    if (!response.count) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }

  return event.res.statusCode = 204;
});
