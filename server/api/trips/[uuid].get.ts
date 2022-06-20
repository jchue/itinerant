import { PrismaClient } from '@prisma/client';
import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;

  let tripData = null;
  try {
    /**
     * findUnique() requires UNIQUE constraint in DB
     * Consider changing to findFirst() if performance becomes detrimental
     */
    tripData = await prisma.trip.findUnique({
      where: {
        uuid: event.context.params.uuid,
      },
      select: {
        uuid: true,
        name: true,
        flight: {
          select: {
            uuid: true,
            airline: {
              select: {
                code: true,
                name: true,
              },
            },
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
          },
        },
        stay: {
          select: {
            uuid: true,
            name: true,
            checkinTimestamp: true,
            checkoutTimestamp: true,
            timezoneName: true,
          },
        },
      },
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    }));

    return;
  }

  // Arrange trip items into distinct events
  const events = [];
  tripData.flight.forEach((flight) => {
    events.push({
      uuid: flight.uuid,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      departureTimestamp: flight.departureTimestamp,
      departureTimezoneName: flight.departureTimezoneName  || 'Etc/UTC',
      arrivalAirport: flight.arrivalAirport,
      arrivalTimestamp: flight.arrivalTimestamp,
      arrivalTimezoneName: flight.arrivalTimezoneName || 'Etc/UTC',
      indexTimestamp: flight.departureTimestamp,
      indexTimezoneName: flight.departureTimezoneName  || 'Etc/UTC',
      type: 'flight',
    });
  });
  tripData.stay.forEach((stay) => {
    const checkin = {
      uuid: stay.uuid,
      name: stay.name,
      address: stay.address,
      indexTimestamp: stay.checkinTimestamp,
      indexTimezoneName: stay.timezoneName || 'Etc/UTC',
      type: 'checkin',
    };

    const checkout = {
      uuid: stay.uuid,
      name: stay.name,
      address: stay.address,
      indexTimestamp: stay.checkoutTimestamp,
      indexTimezoneName: stay.timezoneName || 'Etc/UTC',
      type: 'checkout',
    };

    events.push(checkin, checkout);
  });
  events.sort((a, b) => a.indexTimestamp - b.indexTimestamp);
  
  const groupedEvents = events.reduce((acc, obj) => {
    let key = new Date(obj['indexTimestamp']).toISOString().split('T')[0];

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(obj);

    return acc;
  }, {});

  return {
    uuid: tripData.uuid,
    name: tripData.name,
    events: groupedEvents,
  };
});
