import { createError, sendError } from 'h3';
import prisma from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  // Require auth
  if (event.context.auth.error) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    }));

    return null;
  }

  const userId = event.context.auth.user.id;

  let stay = null;
  try {
    /**
     * Using findFirst() to be able to enforce user ID,
     * enforced on trip and event levels
     * UUID currently has UNIQUE constraint in DB,
     * so can change if performance becomes detrimental
     */
    stay = await prisma.stay.findFirst({
      where: {
        uuid: event.context.params.uuid,
        userId,
      },
      select: {
        uuid: true,
        tripId: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        confirmationNumber: true,
        checkinTimestamp: true,
        checkoutTimestamp: true,
        timezoneName: true,
      },
    });

    // If null, most likely invalid params
    if (!stay) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }

  /**
   * Retrieve trip for UUID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prisma.trip.findFirst({
      where: {
        id: stay.tripId,
        userId,
      },
      select: {
        uuid: true,
      },
    });

    /**
     * If null, most likely mismatched user ID
     * between trip and stay
     */
    if (!trip) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }

  // Default to UTC to prevent errors with date functions
  stay.timezoneName = stay.timezoneName || 'Etc/UTC';

  return {
    uuid: stay.uuid,
    tripUuid: trip.uuid,
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
