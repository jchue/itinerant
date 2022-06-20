import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  let flight = null;
  try {
    /**
     * findUnique() requires UNIQUE constraint in DB
     * Consider changing to findFirst() if performance becomes detrimental
     */
    flight = await prisma.flight.findUnique({
      where: {
        uuid: event.context.params.uuid,
      },
      select: {
        uuid: true,
        tripId: true,
        flightNumber: true,
        departureAirport: {
          select: {
            code: true,
            name: true,
          },
        },
        departureTimestamp: true,
        departureTimezoneName: true,
        arrivalAirport: {
          select: {
            code: true,
            name: true,
          },
        },
        arrivalTimestamp: true,
        arrivalTimezoneName: true,
        airline: {
          select: {
            code: true,
            name: true,
          },
        },
        confirmationNumber: true,
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
        id: flight.tripId,
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
  flight.departureTimezoneName = flight.departureTimezoneName || 'Etc/UTC';
  flight.arrivalTimezoneName = flight.arrivalTimezoneName || 'Etc/UTC';

  return {
    uuid: flight.uuid,
    tripUuid: trip.uuid,
    flightNumber: flight.flightNumber,
    departureAirport: flight.departureAirport,
    departureTimestamp: flight.departureTimestamp,
    departureTimezoneName: flight.departureTimezoneName,
    arrivalAirport: flight.arrivalAirport,
    arrivalTimestamp: flight.arrivalTimestamp,
    arrivalTimezoneName: flight.arrivalTimezoneName,
    airline: flight.airline,
    confirmationNumber: flight.confirmationNumber,
  };
});
