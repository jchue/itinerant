import { PrismaClient } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const airlines = prisma.airline.findMany();

  return airlines;
})
