import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';
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

  const prisma = new PrismaClient;
  const body = await useBody(event);

  // Uniqueness currently enforced by DB
  const uuid = uuidv4();

  const {
    tripUuid,
    name,
    address,
    latitude,
    longitude,
    confirmationNumber,
    checkinTimestamp,
    checkoutTimestamp,
    timezoneName,
  } = body;

  // Check required fields
  if (
    !tripUuid
    || !name
    || !checkinTimestamp
    || !checkoutTimestamp
    || !timezoneName
  ) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'tripUuid, name, checkinTimestamp, checkoutTimestamp, and timezoneName are required.',
    }));

    return;
  }

  // Validate timezones
  try {
    await $fetch(`/api/timezones/${timezoneName}`);
  } catch (error) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid timezone.',
    }));

    return;
  }

  /**
   * Retrieve trip for ID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prisma.trip.findFirst({
      where: {
        uuid: tripUuid,
        userId,
      },
      select: {
        id: true,
      },
    });

    // If null, most likely invalid params
    if (!trip) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  let stay = null;
  try {
    stay = await prisma.stay.create({
      data: {
        uuid: uuid,
        tripId: trip.id,
        userId,
        name,
        address,
        latitude,
        longitude,
        confirmationNumber,
        checkinTimestamp,
        checkoutTimestamp,
        timezoneName,
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
    uuid: stay.uuid,
    tripUuid,
    name: stay.name,
    address: stay.address,
    latitude: stay.latitude,
    longitude: stay.longitude,
    confirmationNumber: stay.confirmationNumber,
    checkinTimestamp: stay.checkinTimestamp,
    checkoutTimestamp: stay.checkoutTimestamp,
    timezoneName: stay.timezoneName,
  };
});
