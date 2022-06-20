import { PrismaClient } from "@prisma/client";
import { createError, sendError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const prisma = new PrismaClient();

    const airline = await prisma.airline.findUnique({
      where: {
        code: event.context.params.code,
      },
      select: {
        code: true,
        name: true,
      },
      rejectOnNotFound: true,
    });

    return airline;
  } catch (error) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return;
  }
});
