import getTimezoneOffset from 'date-fns-tz/getTimezoneOffset';

export default defineNuxtPlugin(async (nuxtApp) => {
  function getUtcOffset(timezone, date) {
    /* Convert from milliseconds to hours */
    const hoursOffset = getTimezoneOffset(timezone, date) / 60 / 60 / 1000;

    /* Add leading zeroes */
    function leadingZeroes(number) {
      if (number === 0) {
        return '00';
      } else if (number < 10) {
        return String('0' + number);
      }

      return number;
    }

    const sign = Math.sign(hoursOffset) < 0 ? '-' : '';
    const hours = leadingZeroes(Math.floor(Math.abs(hoursOffset)));
    const minutes = leadingZeroes(Math.abs((hoursOffset % 1) * 60));
    const offset = `${sign}${hours}:${minutes}`;

    return offset;
  }

  let { data: timezones } = await useFetch('/api/timezones');

  /* Add calculated offset to each timezone */
  timezones = timezones.value.map((timezone) => ({
    offset: getUtcOffset(timezone),
    name: timezone,
  }));

  /* Sort by offset instead of alphabetical timezone */
  timezones.sort((a, b) => (Number(a.offset.replace(':', '')) - Number(b.offset.replace(':', ''))));

  return {
    provide: {
      // TODO: Timezone offset relative to date?
      timezones: () => timezones,
    },
  };
});
