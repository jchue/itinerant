import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const trip = await prisma.trip.delete({
    where: {
      id: parseInt(event.context.params.id),
    },
  });

  return trip;
});
