import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  let trips = [];

  try {
    const tripsData = await prisma.trip.findMany({
      select: {
        id: true,
        name: true,
        flight: {
          select: {
            departureTimestamp: true,
            departureTimezoneName: true,
            arrivalTimestamp: true,
            arrivalTimezoneName: true,
          },
        },
        stay: {
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
      const timestamps = [];
      trip.flight.forEach((flight) => {
        timestamps.push({
          timestamp: flight.departureTimestamp,
          timezoneName: flight.departureTimezoneName || 'Etc/UTC',
        });
        timestamps.push({
          timestamp: flight.arrivalTimestamp,
          timezoneName: flight.arrivalTimezoneName || 'Etc/UTC',
        });
      });
      trip.stay.forEach((stay) => {
        timestamps.push({
          timestamp: stay.checkinTimestamp,
          timezoneName: stay.timezoneName || 'Etc/UTC',
        });
        timestamps.push({
          timestamp: stay.checkoutTimestamp,
          timezoneName: stay.timezoneName || 'Etc/UTC',
        });
      })
      timestamps.sort((a, b) => a.timestamp - b.timestamp);

      /* TODO: Cconditional for trips w/o any */

      return {
        id: trip.id,
        name: trip.name,
        start: timestamps[0],
        end: timestamps[timestamps.length - 1],
      };
    });
  } catch(error) {
    throw(error);
  } finally {
    await prisma.$disconnect();
  }

  return trips;
})
