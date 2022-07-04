import { createError, sendError } from 'h3';
import { v4 as uuidv4 } from 'uuid';
import { prismaClient, Prisma } from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  // Require auth
  if (event.context.auth.error) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    }));

    return null;
  }

  const userId: string = event.context.auth.user.id;

  const body = await useBody(event);

  // Uniqueness currently enforced by DB
  const uuid: string = uuidv4();

  interface Airline {
    code: string,
    name: string,
  }

  interface Airport {
    code: string,
    name: string,
  }

  const {
    tripUuid,
    airline,
    flightNumber,
    departureAirport,
    departureTimestamp,
    departureTimezoneName,
    arrivalAirport,
    arrivalTimestamp,
    arrivalTimezoneName,
    confirmationNumber,
  }: {
    tripUuid: string,
    airline: Airline,
    flightNumber: number,
    departureAirport: Airport,
    departureTimestamp: Date,
    departureTimezoneName: string,
    arrivalAirport: Airport,
    arrivalTimestamp: Date,
    arrivalTimezoneName: string,
    confirmationNumber: string,
  } = body;

  // Check required fields
  if (
    !tripUuid
    || !airline
    || !flightNumber
    || !departureAirport
    || !departureTimestamp
    || !departureTimezoneName
    || !arrivalAirport
    || !arrivalTimestamp
    || !arrivalTimezoneName
  ) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'tripUuid, airline, flightNumber, departureAirport, departureTimestamp, departureTimezoneName, arrivalAirport, arrivaltimestamp, and arrivalTimezoneName are required.',
    }));

    return null;
  }

  // Check flight number format
  if (!Number.isInteger(flightNumber)) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid flightNumber',
    }));

    return null;
  }

  // Validate timezones
  try {
    await $fetch(`/api/timezones/${departureTimezoneName}`);
    await $fetch(`/api/timezones/${arrivalTimezoneName}`);
  } catch (error) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid timezone.',
    }));

    return null;
  }

  /**
   * Retrieve trip for ID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prismaClient.trip.findFirst({
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
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }

  let flight = null;
  try {
    flight = await prismaClient.flight.create({
      data: {
        uuid,
        tripId: trip.id,
        userId,
        airlineCode: airline.code,
        flightNumber: parseInt(flightNumber, 10) || undefined,
        departureAirportCode: departureAirport.code,
        departureTimestamp,
        departureTimezoneName,
        arrivalAirportCode: arrivalAirport.code,
        arrivalTimestamp,
        arrivalTimezoneName,
        confirmationNumber,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return null;
  }

  event.res.statusCode = 201;

  return {
    uuid: flight.uuid,
    tripUuid,
    airlineCode: flight.airlineCode,
    flightNumber: flight.flightNumber,
    departureAirportCode: flight.departureAirportcode,
    departureTimestamp: flight.departureTimestamp,
    departureTimezoneName: flight.departureTimezoneName,
    arrivalAirportCode: flight.arrivalAirportCode,
    arrivalTimestamp: flight.arrivalTimestamp,
    arrivalTimezoneName: flight.arrivalTimezoneName,
    confirmationNumber: flight.confirmationNumber,
  };
});
