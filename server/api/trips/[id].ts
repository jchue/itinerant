import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;

  const tripData = await prisma.trip.findUnique({
    where: {
      id: parseInt(event.context.params.id),
    },
    select: {
      name: true,
      flight: {
        select: {
          id: true,
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
        },
      },
      stay: {
        select: {
          id: true,
          name: true,
          checkinTimestamp: true,
          checkoutTimestamp: true,
          timezoneName: true,
        },
      },
    },
  });

  /* Arrange trip items into distinct events */
  const events = [];
  tripData.flight.forEach((flight) => {
    events.push({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      departureTimestamp: flight.departureTimestamp,
      departureTimezoneName: flight.departureTimezoneName  || 'Etc/UTC',
      arrivalAirport: flight.arrivalAirport,
      arrivalTimestamp: flight.arrivalTimestamp,
      arrivalTimezoneName: flight.arrivalTimezoneName || 'Etc/UTC',
      indexTimestamp: flight.departureTimestamp,
      indexTimezoneName: flight.departureTimezone  || 'Etc/UTC',
      type: 'flight',
    });
  });
  tripData.stay.forEach((stay) => {
    const checkin = {
      id: stay.id,
      name: stay.name,
      address: stay.address,
      indexTimestamp: stay.checkinTimestamp,
      indexTimezoneName: stay.timezoneName || 'Etc/UTC',
      type: 'checkin',
    };

    const checkout = {
      id: stay.id,
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
    name: tripData.name,
    events: groupedEvents,
  };
});
