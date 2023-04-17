import { v4 as uuidv4 } from 'uuid';
import { prismaClient, Prisma } from '@/lib/db';
import { Trip } from '@prisma/client';
import HTTPError from './error';

export default async function writeTrip(userId: string, trip: Trip) {
  let { uuid, name, destination } = trip;

  // Check required fields
  if (!name || !destination) {
    throw new HTTPError(400, 'name and destination are required');
  }

  try {
    /**
     * Update trip
     */
    if (uuid) {
      // Using updateMany() to be able to enforce user ID
      const trip = await prismaClient.trip.updateMany({
        where: {
          uuid,
          userId,
        },
        data: {
          name,
          destination,
        },
      });

      if (!trip.count) throw new Error();

      return true;
    }

    /**
     * Create trip
     */

    // Uniqueness currently enforced by DB
    uuid = uuidv4();

    const newTrip: Prisma.TripCreateInput = {
      uuid,
      userId,
      name,
      destination,
    };

    const tripInfo = Prisma.validator<Prisma.TripSelect>()({
      uuid: true,
      name: true,
      destination: true,
    });

    const createTrip = await prismaClient.trip.create({
      data: newTrip,
      select: tripInfo,
    });

    return createTrip;
  } catch (error) {
    throw error;
  }
}
