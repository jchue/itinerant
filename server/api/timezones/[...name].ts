import { createError, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  /* Call all timezones endpoint */
  const timezones = await $fetch('/api/timezones');

  const timezone = timezones.find((element) => element === event.context.params.name);

  if (!timezone) {
    sendError(event, createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    }));

    return null;
  }
  return timezone;
});
