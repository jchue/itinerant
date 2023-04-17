import { prismaClient } from './db';
import HTTPError from './error';

export default async function getStay(userId: string, uuid: string) {
  try {
    /**
     * Using findFirst() to be able to enforce user ID,
     * enforced on trip and event levels
     * UUID currently has UNIQUE constraint in DB,
     * so can change if performance becomes detrimental
     */
    const stay = await prismaClient.stay.findFirst({
      where: {
        uuid,
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

    if (!stay) throw new HTTPError(404, 'Not Found');

    /**
     * Retrieve trip for UUID
     * Using findFirst() to be able to enforce user ID
     */
    const trip = await prismaClient.trip.findFirst({
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
  } catch (error) {
    throw error;
  }
}
