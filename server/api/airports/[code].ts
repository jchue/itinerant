import { PrismaClient } from "@prisma/client";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();

  let airport = null;
  try {
    airport = await prisma.airport.findUnique({
      where: {
        code: event.context.params.code,
      },
      select: {
        code: true,
        name: true,
        latitude: true,
        longitude: true,
      },
      rejectOnNotFound: true,
    });
  } catch (error) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return;
  }

  return airport;
});
