import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  const stay = await prisma.stay.findUnique({
    where: {
      id: parseInt(event.context.params.id),
    },
    select: {
      tripId: true,
      name: true,
      address: true,
      confirmationNumber: true,
      checkinTimestamp: true,
      checkoutTimestamp: true,
      timezoneName: true,
    },
  });

  /* Default to UTC to prevent errors with date functions */
  stay.timezoneName = stay.timezoneName || 'Etc/UTC';

  return stay;
});
