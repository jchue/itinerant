import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  let stay = null;
  try {
    /**
     * findUnique() requires UNIQUE constraint in DB
     * Consider changing to findFirst() if performance becomes detrimental
     */
    stay = await prisma.stay.findUnique({
      where: {
        uuid: event.context.params.uuid,
      },
      select: {
        uuid: true,
        tripId: true,
        name: true,
        address: true,
        confirmationNumber: true,
        checkinTimestamp: true,
        checkoutTimestamp: true,
        timezoneName: true,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  // Retrieve trip for UUID
  let trip = null;
  try {
    trip = await prisma.trip.findUnique({
      where:{
        id: stay.tripId,
      },
      select: {
        uuid: true,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  // Default to UTC to prevent errors with date functions
  stay.timezoneName = stay.timezoneName || 'Etc/UTC';

  return {
    uuid: stay.uuid,
    tripUuid: trip.uuid,
    name: stay.name,
    address: stay.address,
    confirmationNumber: stay.confirmationNumber,
    checkinTimestamp: stay.checkinTimestamp,
    checkoutTimestamp: stay.checkoutTimestamp,
    timezoneName: stay.timezoneName,
  };
});
