import { Trip, Flight, Stay } from '@prisma/client';

interface DateTime {
  timestamp: Date,
  timezoneName: string
}

// Used to bridge Prisma client
interface Trip extends Trip {
  image: string | null,
  start: DateTime,
  end: DateTime,
}

// Used to bridge Prisma client b/c it still allows null for required fields
interface Flight extends Flight {
  tripUuid: string,
  airlineCode: string,
  flightNumber: number,
}

// Used to bridge Prisma client b/c it still allows null for required fields
interface Stay extends Stay {
  tripUuid: string,
  name: string,
}

