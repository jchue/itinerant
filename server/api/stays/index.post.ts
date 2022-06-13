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

  const flight = await prisma.stay.create({
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

  return flight;
});
