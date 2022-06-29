import prisma from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  const airlines = await prisma.airline.findMany();

  return airlines.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });
});
