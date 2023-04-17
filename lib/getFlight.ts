import { prismaClient } from './db';
import HTTPError from './error';

export default async function getFlight(userId: string, uuid: string) {
  try {
    /**
     * Using findFirst() to be able to enforce user ID,
     * enforced on trip and event levels
     * UUID currently has UNIQUE constraint in DB,
     * so can change if performance becomes detrimental
     */
    const flight = await prismaClient.flight.findFirst({
      where: {
        uuid,
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

    if (!flight) throw new HTTPError(404, 'Not Found');

    /**
     * Retrieve trip for UUID
     * Using findFirst() to be able to enforce user ID
     */

    const trip = await prismaClient.trip.findFirst({
      where: {
        id: flight.tripId,
        userId,
      },
      select: {
        uuid: true,
      },
    });

    // If null, most likely mismatched user ID between trip and flight
    if (!trip) throw new Error();

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
  } catch (error) {
    throw error;
  }
}
