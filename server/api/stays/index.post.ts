import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;
  const body = await useBody(event);

  // Uniqueness currently enforced by DB
  const uuid = uuidv4();

  const {
    tripUuid,
    name,
    address,
    confirmationNumber,
    checkinTimestamp,
    checkoutTimestamp,
    timezoneName
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

  // Retrieve trip for ID
  let trip = null;
  try {
    trip = await prisma.trip.findUnique({
      where:{
        uuid: tripUuid,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));
  }

  let stay = null;
  try {
    stay = await prisma.stay.create({
      data: {
        uuid: uuid,
        tripId: trip.id,
        name,
        address,
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
    confirmationNumber: stay.confirmationNumber,
    checkinTimestamp: stay.checkinTimestamp,
    checkoutTimestamp: stay.checkoutTimestamp,
    timezoneName: stay.timezoneName,
  };
});
