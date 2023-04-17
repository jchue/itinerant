import { v4 as uuidv4 } from 'uuid';
import tzData from 'geo-tz/data/index.json';
import { prismaClient } from '@/lib/db';
import { Flight } from '@/additional';
import HTTPError from './error';

export default async function writeFlight(userId: string, flight: Flight) {
  interface Airline {
    code: string,
    name: string,
  }

  interface Airport {
    code: string,
    name: string,
  }

  let {
    uuid,
    tripUuid,
    airlineCode,
    flightNumber,
    departureAirportCode,
    departureTimestamp,
    departureTimezoneName,
    arrivalAirportCode,
    arrivalTimestamp,
    arrivalTimezoneName,
    confirmationNumber,
  }: {
    uuid: string,
    tripUuid: string,
    airlineCode: string,
    flightNumber: number,
    departureAirportCode: string,
    departureTimestamp: Date,
    departureTimezoneName: string,
    arrivalAirportCode: string,
    arrivalTimestamp: Date,
    arrivalTimezoneName: string,
    confirmationNumber: string | null,
  } = flight;

  // Check required fields
  if (
    !tripUuid
    || !airlineCode
    || !flightNumber
    || !departureAirportCode
    || !departureTimestamp
    || !departureTimezoneName
    || !arrivalAirportCode
    || !arrivalTimestamp
    || !arrivalTimezoneName
  ) {
    throw new HTTPError(400, 'tripUuid, airlineCode, flightNumber, departureAirportCode, departureTimestamp, departureTimezoneName, arrivalAirportCode, arrivaltimestamp, and arrivalTimezoneName are required.');
  }

  // Check flight number format
  if (!Number.isInteger(flightNumber)) throw new HTTPError(400, 'Invalid flightNumber');

  // Validate timezones
  const { timezones } = tzData;
  if (!(timezones.find((element) => element === departureTimezoneName) && timezones.find((element) => element === arrivalTimezoneName))) throw new HTTPError(400, 'Invalid timezone');

  try {
    /**
     * Retrieve trip for ID
     * Using findFirst() to be able to enforce user ID
     */
    const trip = await prismaClient.trip.findFirst({
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

    if (uuid) {
      /**
       * Update flight
       */

      // Using updateMany() to be able to enforce user ID
      const flight = await prismaClient.flight.updateMany({
        where: {
          uuid,
          userId,
        },
        data: {
          tripId: trip.id,
          airlineCode,
          flightNumber,
          departureAirportCode,
          departureTimestamp,
          departureTimezoneName,
          arrivalAirportCode,
          arrivalTimestamp,
          arrivalTimezoneName,
          confirmationNumber,
        },
      });
  
      // If no records updated, most likely invalid params
      if (!flight.count) throw new Error();

      return true;
    }

    /**
     * Create flight
     */

    // Uniqueness currently enforced by DB
    uuid = uuidv4();

    const flight = await prismaClient.flight.create({
      data: {
        uuid,
        tripId: trip.id,
        userId,
        airlineCode,
        flightNumber,
        departureAirportCode,
        departureTimestamp,
        departureTimezoneName,
        arrivalAirportCode,
        arrivalTimestamp,
        arrivalTimezoneName,
        confirmationNumber,
      },
    });

    return {
      uuid: flight.uuid,
      tripUuid,
      airlineCode: flight.airlineCode,
      flightNumber: flight.flightNumber,
      departureAirportCode: flight.departureAirportCode,
      departureTimestamp: flight.departureTimestamp,
      departureTimezoneName: flight.departureTimezoneName,
      arrivalAirportCode: flight.arrivalAirportCode,
      arrivalTimestamp: flight.arrivalTimestamp,
      arrivalTimezoneName: flight.arrivalTimezoneName,
      confirmationNumber: flight.confirmationNumber,
    };
  } catch (error) {
    throw error;
  }
}
