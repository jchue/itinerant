import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  // Require auth
  if (event.context.auth.error) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    }));

    return;
  }

  const userId = event.context.auth.user.id;

  const prisma = new PrismaClient();
  const body = await useBody(event);

  const { name } = body;

  // Check required fields
  if (!name) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'name is required.',
    }));

    return;
  }

  try {
    // Using updateMany() to be able to enforce user ID
    const response = await prisma.trip.updateMany({
      where: {
        uuid: event.context.params.uuid,
        userId,
      },
      data: {
        name,
      },
    });

    // If no records updated, most likely invalid params
    if (!response.count) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  return event.res.statusCode = 204;
});
