import { createError, sendError, send } from 'h3';
import { v4 as uuidv4 } from 'uuid';
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

  const body = await useBody(event);

  // Uniqueness currently enforced by DB
  const uuid: string = uuidv4();

  const { name } = body;

  // Check required fields
  if (!name) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'name is required.',
    }));

    return null;
  }

  const trip: Prisma.TripCreateInput = {
    uuid,
    userId,
    name,
  };

  const tripInfo = Prisma.validator<Prisma.TripSelect>()({
    uuid: true,
    name: true,
  });

  try {
    const createTrip = await prismaClient.trip.create({
      data: trip,
      select: tripInfo,
    });

    event.res.statusCode = 201;

    return createTrip;
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }
});
