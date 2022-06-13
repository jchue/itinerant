import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient;
  const body = await useBody(event);

  const {
    tripId,
    name,
    address,
    confirmationNumber,
    checkinTimestamp,
    checkoutTimestamp,
    timezoneName
  } = body;

  const stay = await prisma.stay.update({
    where: {
      id: parseInt(event.context.params.id),
    },
    data: {
      tripId,
      name,
      address,
      confirmationNumber,
      checkinTimestamp,
      checkoutTimestamp,
      timezoneName,
    },
  });

  return stay;
})
