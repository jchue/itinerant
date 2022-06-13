import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const airports = await prisma.airport.findMany();

  return airports;
})
