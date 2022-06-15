import { PrismaClient } from "@prisma/client";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;
  const body = await useBody(event);

  const {
    tripId,
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

  /* Check required fields */
  if (
    !tripId
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
      statusMessage: 'tripId, airline, flightNumber, departureAirport, departureTimestamp, departureTimezoneName, arrivalAirport, arrivaltimestamp, and arrivalTimezoneName are required.',
    }));

    return;
  }

  const flight = await prisma.flight.create({
    data: {
      tripId,
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

  return flight;
});
