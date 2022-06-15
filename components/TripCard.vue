<script lang="ts">
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

export default {
  props: ['id', 'name', 'startTimestamp', 'startTimezoneName', 'endTimestamp', 'endTimezoneName'],
  computed: {
    startDate() {
      return this.startTimestamp ? format(utcToZonedTime(this.startTimestamp, this.startTimezoneName), 'MMM do') : '';
    },
    endDate() {
      return this.endTimestamp ? format(utcToZonedTime(this.endTimestamp, this.endTimezoneName), 'MMM do') : '';
    },
    range() {
      if (this.startDate && this.endDate) {
        if (this.startDate === this.endDate) {
          /* If both dates are the same, only return one */
          return this.startDate;
        } else {
          /* If dates are different, return range */
          return `${this.startDate} - ${this.endDate}`;
        }
      } else {
        /* If return one date or none at all */
        return this.startDate || this.endDate || null;
      }
    },
  },
};
</script>

<template>
  <div class="block cursor-pointer font-sans my-4 p-4 rounded shadow hover:shadow-md transition-shadow">
    <span class="block font-bold">{{ name }}</span>
    <span class="block text-slate-500 text-sm">{{ range }}</span>
  </div>
</template>

<style scoped></style>
