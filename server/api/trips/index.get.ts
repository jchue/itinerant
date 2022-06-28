import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

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

  const prisma = new PrismaClient();

  let trips = [];

  try {
    // User ID enforced on both trip and feature levels
    const tripsData = await prisma.trip.findMany({
      where: {
        userId,
      },
      select: {
        uuid: true,
        name: true,
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

      return {
        uuid: trip.uuid,
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