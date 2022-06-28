const { PrismaClient } = require('@prisma/client');
const { $fetch } = require('ohmyfetch');

const prisma = new PrismaClient();

async function seedAirlines() {
  const airlinesData = await $fetch('https://api.travelpayouts.com/data/en/airlines.json');

  const airlines = airlinesData.map((airline) => {
    return {
      code: airline.code,
      name: airline.name,
    };
  });

  airlines.sort((a, b) => {
    if (a.code < b.code) {
      return -1;
    }
    if (a.code > a.code) {
      return 1;
    }

    return 0;
  });

  for(const airline of airlines) {
    try {
      const response = await prisma.airline.upsert({
        where: {
          code: airline.code,
        },
        update: {},
        create: {
          code: airline.code,
          name: airline.name,
        },
      });
    } catch (error) {
      console.error('Failed to seed record:')
      console.error(airline);
      console.error(error.message);
    }
  }
}

async function seedAirports() {
  const data = await $fetch('https://api.travelpayouts.com/data/en/airports.json');

  const airportsData = data.filter((element) => element.iata_type === 'airport' && element.flightable === true);

  const airports = airportsData.map((airport) => {
    return {
      code: airport.code,
      name: airport.name,
      timezoneName: airport.time_zone,
      countryCode: airport.country_code,
      cityCode: airport.city_code,
      coordinates: airport.coordinates,
    };
  });

  airports.sort((a, b) => {
    if (a.code < b.code) {
      return -1;
    }
    if (a.code > a.code) {
      return 1;
    }

    return 0;
   });

  for(const airport of airports) {
    try {
      const response = await prisma.airport.upsert({
        where: {
          code: airport.code,
        },
        update: {},
        create: {
          code: airport.code,
          name: airport.name,
          latitude: airport.coordinates.lat,
          longitude: airport.coordinates.lon,
        },
      });
    } catch (error) {
      console.error('Failed to seed record:')
      console.error(airport);
      console.error(error.message);
    }
  }
}

async function main() {
  await seedAirlines();
  await seedAirports();
  await prisma.$disconnect();
}

main();