import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const stay = await prisma.stay.delete({
    where: {
      id: parseInt(event.context.params.id),
    },
  });

  return stay;
});
