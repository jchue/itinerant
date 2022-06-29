import { createError, sendError } from 'h3';
import prisma from '@/server/utils/db';

export default defineEventHandler(async (event) => {
  try {
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
