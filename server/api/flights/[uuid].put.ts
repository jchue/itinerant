import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;
  const body = await useBody(event);

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

  // Retrieve trip for ID
  let trip = null;
  try {
    trip = await prisma.trip.findUnique({
      where:{
        uuid: tripUuid,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  let flight = null;
  try {
    flight = await prisma.flight.update({
      where: {
        uuid: event.context.params.uuid,
      },
      data: {
        tripId: trip.id,
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

  return {
    uuid: flight.uuid,
    tripUuid: tripUuid,
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
})
