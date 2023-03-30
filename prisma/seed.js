const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAirlines() {
  const response = await fetch('https://api.travelpayouts.com/data/en/airlines.json');
  const airlinesData = await response.json();

  const airlines = airlinesData.map((airline) => ({
    code: airline.code,
    name: airline.name,
  }));

  airlines.sort((a, b) => {
    if (a.code < b.code) {
      return -1;
    }
    if (a.code > b.code) {
      return 1;
    }

    return 0;
  });

  airlines.forEach(async (airline) => {
    try {
      await prisma.airline.upsert({
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
      console.error('Failed to seed record:');
      console.error(airline);
      console.error(error.message);
    }
  });
}

async function seedAirports() {
  const response = await fetch('https://api.travelpayouts.com/data/en/airports.json');
  const data = await response.json();

  const airportsData = data.filter((element) => element.iata_type === 'airport' && element.flightable === true);

  const airports = airportsData.map((airport) => ({
    code: airport.code,
    name: airport.name,
    timezoneName: airport.time_zone,
    countryCode: airport.country_code,
    cityCode: airport.city_code,
    coordinates: airport.coordinates,
  }));

  airports.sort((a, b) => {
    if (a.code < b.code) {
      return -1;
    }
    if (a.code > b.code) {
      return 1;
    }

    return 0;
  });

  airports.forEach(async (airport) => {
    try {
      await prisma.airport.upsert({
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
      console.error('Failed to seed record:');
      console.error(airport);
      console.error(error.message);
    }
  });
}

async function main() {
  await seedAirlines();
  await seedAirports();
  await prisma.$disconnect();
}

main();
