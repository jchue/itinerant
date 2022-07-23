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
        || this.duration.hours || this.duration.minutes || this.duration.seconds)
      ) {
        return '|';
      }

      return null;
    },
  },
};
</script>

<template>
  <div class="flex items-center p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
    <div class="flex-1">
      <!-- Depart/Arrive -->
      <div class="flex">
        <!-- Depart -->
        <div class="mr-10 shrink">
          <div class="text-gray-600 text-xs uppercase">Depart</div>
          <div class="text-2xl">
            <span class="font-bold mr-4 text-emerald-700">{{ departureTime }}</span>
            <span class="font-light text-gray-600">{{ departureAirport }}</span>
          </div>
          <div class="font-light -mt-1 text-gray-500 text-[0.625rem]">{{ departureTimezoneName }}</div>
        </div>

        <!-- Arrive -->
        <div class="shrink">
          <div class="text-gray-600 text-xs uppercase">Arrive</div>
          <div class="text-2xl">
            <span class="font-bold mr-4 text-emerald-700">{{ arrivalTime }}</span>
            <span class="font-light text-gray-600">{{ arrivalAirport }}</span>
          </div>
          <div class="font-light -mt-1 text-gray-500 text-[0.625rem]">{{ arrivalTimezoneName }}</div>
        </div>
      </div>

      <!-- Flight Name -->
      <div class="font-light mt-6 text-emerald-700 text-xl">
        {{ airline ? `${airline.name} ${airline.code}` : '' }} {{ flightNumber }} {{ delimiter }} {{ duration.days ? duration.days + 'd' : '' }} {{ duration.hours ? duration.hours + 'h' : '' }} {{ duration.minutes ? duration.minutes + 'm' : '' }}
      </div>
    </div>
    <div class="flex-none text-center w-20">
        <span class="material-icons !text-4xl text-slate-300">flight</span>
      </div>
  </div>
</template>

<style scoped></style>
