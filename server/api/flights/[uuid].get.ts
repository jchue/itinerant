import { createError, sendError } from 'h3';
import prisma from '@/server/utils/db';

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

  let flight = null;
  try {
    /**
     * Using findFirst() to be able to enforce user ID,
     * enforced on trip and event levels
     * UUID currently has UNIQUE constraint in DB,
     * so can change if performance becomes detrimental
     */
    flight = await prisma.flight.findFirst({
      where: {
        uuid: event.context.params.uuid,
        userId,
      },
      select: {
        uuid: true,
        tripId: true,
        flightNumber: true,
        departureAirport: {
          select: {
            code: true,
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        departureTimestamp: true,
        departureTimezoneName: true,
        arrivalAirport: {
          select: {
            code: true,
            name: true,
            latitude: true,
            longitude: true,
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

    // If null, most likely invalid params
    if (!flight) throw new Error();
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  /**
   * Retrieve trip for UUID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prisma.trip.findFirst({
      where: {
        id: flight.tripId,
        userId,
      },
      select: {
        uuid: true,
      },
    });

    /**
     * If null, most likely mismatched user ID
     * between trip and flight
     */
    if (!trip) throw new Error();
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
