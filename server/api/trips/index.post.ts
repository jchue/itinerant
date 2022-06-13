import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const body = await useBody(event);

  const { name } = body;

  const trip = await prisma.trip.create({
    data: {
      name,
    },
  });

  return trip;
});
