import { createError, sendError } from 'h3';
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

  const body = await readBody(event);

  // Uniqueness currently enforced by DB
  const uuid: string = uuidv4();

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
  }: {
    tripUuid: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    confirmationNumber: string,
    checkinTimestamp: Date,
    checkoutTimestamp: Date,
    timezoneName: string,
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

    return null;
  }

  // Validate timezones
  try {
    await $fetch(`/api/timezones/${timezoneName}`);
  } catch (error) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid timezone.',
    }));

    return null;
  }

  /**
   * Retrieve trip for ID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prismaClient.trip.findFirst({
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

    return null;
  }

  let stay = null;
  try {
    stay = await prismaClient.stay.create({
      data: {
        uuid,
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

    return null;
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
