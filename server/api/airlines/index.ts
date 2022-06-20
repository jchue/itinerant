import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const airlines = await prisma.airline.findMany();

  return airlines.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > a.name) {
      return 1;
    }

    return 0;
  });
})
