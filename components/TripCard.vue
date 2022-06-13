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
  },
};
</script>

<template>
  <div class="block cursor-pointer font-sans my-4 p-4 rounded shadow hover:shadow-md transition-shadow">
    <span class="block font-bold">{{ name }}</span>
    <span class="block text-slate-500 text-sm">{{ startDate }} - {{ endDate }}</span>
  </div>
</template>

<style scoped></style>
