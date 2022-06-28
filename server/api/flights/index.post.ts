import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';
import { v4 as uuidv4 } from 'uuid';

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

  const prisma = new PrismaClient;
  const body = await useBody(event);

  // Uniqueness currently enforced by DB
  const uuid = uuidv4();

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

    return;
  }

  // Check flight number format
  if (isNaN(flightNumber)) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid flightNumber',
    }));

    return;
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

    return;
  }

  /**
   * Retrieve trip for ID
   * Using findFirst() to be able to enforce user ID
   */
  let trip = null;
  try {
    trip = await prisma.trip.findFirst({
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

    return;
  }

  let flight = null;
  try {
    flight = await prisma.flight.create({
      data: {
        uuid: uuid,
        tripId: trip.id,
        userId,
        airlineCode: airline.code,
        flightNumber: parseInt(flightNumber) || undefined,
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

    return;
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
