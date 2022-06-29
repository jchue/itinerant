import { createError, sendError } from 'h3';
import prisma from '@/server/utils/db';

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
  const requestedId = event.context.params.uuid;

  // Requesting user must be requested user
  if (userId !== requestedId) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Not Authorized',
    }));

    return;
  }

  try {
    const { error } = await event.context.auth
      .supabase.auth.api.deleteUser(requestedId);

    if (error) throw error;

    // Delete associated trips
    await prisma.trip.deleteMany({
      where: {
        userId,
      },
    });

    return event.res.statusCode = 204;
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }
});
