import { createError, sendError } from 'h3';
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import prisma from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  // Require auth
  if (event.context.auth.error) {
    sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    }));

    return null;
  }

  const userId = event.context.auth.user.id;

  let tripData = null;
  try {
    /**
     * Using findFirst() to be able to enforce user ID,
     * enforced on trip and event levels
     * UUID currently has UNIQUE constraint in DB,
     * so can change if performance becomes detrimental
     */
    tripData = await prisma.trip.findFirst({
      where: {
        uuid: event.context.params.uuid,
        userId,
      },
      select: {
        uuid: true,
        name: true,
        flight: {
          where: {
            userId,
          },
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
          where: {
            userId,
          },
          select: {
            uuid: true,
            name: true,
            latitude: true,
            longitude: true,
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

    return null;
  }

  if (!tripData) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return null;
  }

  // Arrange trip items into distinct events and GeoJSON features
  const events = [];
  const features = [];
  tripData.flight.forEach((flight) => {
    events.push({
      uuid: flight.uuid,
      airline: flight.airline,
      flightNumber: flight.flightNumber,
      departureAirport: flight.departureAirport,
      departureTimestamp: flight.departureTimestamp,
      departureTimezoneName: flight.departureTimezoneName || 'Etc/UTC',
      arrivalAirport: flight.arrivalAirport,
      arrivalTimestamp: flight.arrivalTimestamp,
      arrivalTimezoneName: flight.arrivalTimezoneName || 'Etc/UTC',
      indexTimestamp: flight.departureTimestamp,
      indexTimezoneName: flight.departureTimezoneName || 'Etc/UTC',
      type: 'flight',
    });

    features.push(
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [flight.departureAirport.longitude, flight.departureAirport.latitude],
        },
        properties: {
          title: flight.departureAirport.code,
          description: flight.departureAirport.name,
          icon: 'airport_15',
        },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [flight.arrivalAirport.longitude, flight.arrivalAirport.latitude],
        },
        properties: {
          title: flight.arrivalAirport.code,
          description: flight.arrivalAirport.name,
          icon: 'airport_15',
        },
      },
    );
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

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [stay.longitude, stay.latitude],
      },
      properties: {
        title: stay.name,
        description: stay.name,
        icon: 'lodging_15',
      },
    });
  });
  events.sort((a, b) => a.indexTimestamp - b.indexTimestamp);

  const groupedEvents = events.reduce((acc, obj) => {
    /**
     * Need to localize date before grouping
     *
     * TODO: Reconsider datetime strategy;
     * inconsistent that we need to localize the date in this instance
     * as opposed to everywhere else
     */
    const localTimestamp = utcToZonedTime(obj['indexTimestamp'], obj['indexTimezoneName']);
    const key = format(localTimestamp, 'yyyy-MM-dd');

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(obj);

    return acc;
  }, {});

  // Compile GeoJSON
  const geojson = {
    type: 'FeatureCollection',
    features,
  };

  return {
    uuid: tripData.uuid,
    name: tripData.name,
    events: groupedEvents,
    geojson,
  };
});
