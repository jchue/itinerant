import { PrismaClient } from "@prisma/client";
import { createError, sendError } from "h3";

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

  /* Check required fields */
  if (
    !tripId
    || !name
    || !checkinTimestamp
    || !checkoutTimestamp
    || !timezoneName
  ) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'tripId, name, checkinTimestamp, checkoutTimestamp, and timezoneName are required.',
    }));

    return;
  }

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
