import { PrismaClient } from "@prisma/client";

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
    arrivalTimezoneName
  } = body;

  const flight = await prisma.flight.update({
    where: {
      id: parseInt(event.context.params.id),
    },
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
    },
  });

  return flight;
})
