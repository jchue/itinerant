import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    const prisma = new PrismaClient();

    const flight = await prisma.flight.findUnique({
      where: {
        id: parseInt(event.context.params.id),
      },
      select: {
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
      },
    });

    /* Default to UTC to prevent errors with date functions */
    flight.departureTimezoneName = flight.departureTimezoneName || 'Etc/UTC';
    flight.arrivalTimezoneName = flight.arrivalTimezoneName || 'Etc/UTC';

    return flight;
  } catch (error) {
    return;
  }
});
