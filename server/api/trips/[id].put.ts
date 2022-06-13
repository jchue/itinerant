import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const body = await useBody(event);

  const { name } = body;

  const trip = await prisma.trip.update({
    where: {
      id: parseInt(event.context.params.id),
    },
    data: {
      name,
    },
  });

  return trip;
});
