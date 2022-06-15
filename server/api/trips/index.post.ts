import { PrismaClient } from "@prisma/client";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  const body = await useBody(event);

  const { name } = body;

  /* Check required fields */
  if (!name) {
    sendError(event, createError({
      statusCode: 400,
      statusMessage: 'name is required.',
    }));

    return;
  }
  const trip = await prisma.trip.create({
    data: {
      name,
    },
  });

  return trip;
});
