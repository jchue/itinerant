import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const flight = await prisma.flight.delete({
    where: {
      id: parseInt(event.context.params.id),
    },
  });

  return flight;
});
