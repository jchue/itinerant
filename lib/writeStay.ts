import { v4 as uuidv4 } from 'uuid';
import tzData from 'geo-tz/data/index.json';
import { prismaClient } from '@/lib/db';
import HTTPError from './error';

export default async function writeStay(userId, stay) {
  let {
    uuid,
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
    uuid: string,
    tripUuid: string,
    name: string,
    address: string,
    latitude: number,
    longitude: number,
    confirmationNumber: string,
    checkinTimestamp: Date,
    checkoutTimestamp: Date,
    timezoneName: string,
  } = stay;

  // Check required fields
  if (
    !tripUuid
    || !name
    || !checkinTimestamp
    || !checkoutTimestamp
    || !timezoneName
  ) {
    throw new HTTPError(400, 'tripUuid, name, checkinTimestamp, checkoutTimestamp, and timezoneName are required.');
  }

  // Validate timezones
  const { timezones } = tzData;
  if (!(timezones.find((element) => element === timezoneName))) throw new HTTPError(400, 'Invalid timezone');

  try {
    /**
     * Retrieve trip for ID
     * Using findFirst() to be able to enforce user ID
     */
    const trip = await prismaClient.trip.findFirst({
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

    if (uuid) {
      /**
       * Update stay
       */

      // Using updateMany() to be able to enforce user ID
      const response = await prismaClient.stay.updateMany({
        where: {
          uuid,
          userId,
        },
        data: {
          tripId: trip.id,
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
  
      // If no records updated, most likely invalid params
      if (!response.count) throw new Error();
    
      return true;
    }

    /**
     * Create stay
     */

    // Uniqueness currently enforced by DB
    uuid = uuidv4();

    const stay = await prismaClient.stay.create({
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
  } catch (error) {
    throw error;
  }
}
