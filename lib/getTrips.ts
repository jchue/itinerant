import { prismaClient } from '@/lib/db';
import { DateTime } from '@/additional';

export default async function getTrips(userId: string) {
  let trips = [];

  try {
    // User ID enforced on both trip and feature levels
    const tripsData = await prismaClient.trip.findMany({
      where: {
        userId,
      },
      select: {
        uuid: true,
        name: true,
        destination: true,
        imageUrl: true,
        flight: {
          where: {
            userId,
          },
          select: {
            departureTimestamp: true,
            departureTimezoneName: true,
            arrivalTimestamp: true,
            arrivalTimezoneName: true,
          },
        },
        stay: {
          where: {
            userId,
          },
          select: {
            checkinTimestamp: true,
            checkoutTimestamp: true,
            timezoneName: true,
          },
        },
      },
    });

    trips = tripsData.map((trip) => {
      /* Find first and last timestamp */
      // TODO: Currently falling back to new Date() b/c timestamp cannot be null
      const timestamps: Array<DateTime> = [];
      trip.flight.forEach((flight) => {
        timestamps.push({
          timestamp: flight.departureTimestamp || new Date(),
          timezoneName: flight.departureTimezoneName || 'Etc/UTC',
        });
        timestamps.push({
          timestamp: flight.arrivalTimestamp || new Date(),
          timezoneName: flight.arrivalTimezoneName || 'Etc/UTC',
        });
      });
      trip.stay.forEach((stay) => {
        timestamps.push({
          timestamp: stay.checkinTimestamp || new Date(),
          timezoneName: stay.timezoneName || 'Etc/UTC',
        });
        timestamps.push({
          timestamp: stay.checkoutTimestamp || new Date(),
          timezoneName: stay.timezoneName || 'Etc/UTC',
        });
      });
      timestamps.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

      return {
        uuid: trip.uuid,
        name: trip.name,
        destination: trip.destination,
        image: trip.imageUrl,
        start: timestamps[0],
        end: timestamps[timestamps.length - 1],
      };
    });

    return trips;
  } catch (error) {
    throw error;
  }
}
