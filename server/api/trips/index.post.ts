import { PrismaClient } from '@prisma/client';
import { createError, sendError, send } from 'h3';
import { v4 as uuidv4 } from 'uuid';

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

  // Uniqueness currently enforced by DB
  const uuid = uuidv4();

  const { name } = body;

  // Check required fields
  if (!name) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'name is required.',
    }));

    return;
  }

  let trip = null;
  try {
    trip = await prisma.trip.create({
      data: {
        uuid,
        userId,
        name,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  event.res.statusCode = 201;

  return {
    uuid: trip.uuid,
    name: trip.name,
  };
});
