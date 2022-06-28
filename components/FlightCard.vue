<script lang="ts">
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

export default {
  props: ['airline', 'flightNumber', 'departureAirport', 'departureTimestamp', 'departureTimezoneName', 'arrivalAirport', 'arrivalTimestamp', 'arrivalTimezoneName'],
  computed: {
    departureDate() {
      return format(utcToZonedTime(this.departureTimestamp, this.departureTimezoneName), 'yyyy-MM-dd');
    },
    departureTime() {
      return format(utcToZonedTime(this.departureTimestamp, this.departureTimezoneName), 'p');
    },
    arrivalDate() {
      return format(utcToZonedTime(this.arrivalTimestamp, this.arrivalTimezoneName), 'yyyy-MM-dd');
    },
    arrivalTime() {
      return format(utcToZonedTime(this.arrivalTimestamp, this.arrivalTimezoneName), 'p');
    },
    duration() {
      return intervalToDuration({
        start: new Date(this.departureTimestamp),
        end: new Date(this.arrivalTimestamp),
      });
    },
    delimiter() {
      if (
        (this.airline || this.flightNumber)
        && (this.duration.years || this.duration.months || this.duration.days
        || this.duration.minutes || this.duration.seconds)
      ) {
        return '|';
      }

      return null;
    },
  },
};
</script>

<template>
  <div class="flex items-center my-4 p-4 rounded shadow hover:shadow-md transition-shadow">
    <div class="flex-none text-center w-20">
      <span class="material-icons !text-4xl text-slate-300">flight</span>
    </div>
    <div class="flex-1">
      <div class="text-slate-500 text-sm">
        {{ airline ? airline.name : '' }} {{ flightNumber }} {{ delimiter }} {{ duration.days ? duration.days + 'd' : '' }} {{ duration.hours ? duration.hours + 'h' : '' }} {{ duration.minutes ? duration.minutes + 'm' : '' }}
      </div>
      <div class="flex">
        <div class="flex-1">
          <span class="block text-2xl">{{ departureTime }}</span>
          <span class="block text-xl text-slate-500">{{ departureAirport }}</span>
        </div>
        <div class="flex-1 text-right">
          <span class="block text-2xl">{{ arrivalTime }}</span>
          <span class="block text-xl text-slate-500">{{ arrivalAirport }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
