<script lang="ts" setup>
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

const route = useRoute();

const flight = await $fetch(`/api/flights/${route.params.id}`);

const tripId = flight.tripId;
const airlineName = flight.airline ? flight.airline.name : null;
const flightDesignator = flight.airline ? `${flight.airline.code} ${flight.flightNumber}` : null;
const departureAirportCode = flight.departureAirport? flight.departureAirport.code : null;
const departureDate = format(utcToZonedTime(flight.departureTimestamp, flight.departureTimezoneName), 'EEE, MMM d, yyyy');
const departureTime = format(utcToZonedTime(flight.departureTimestamp, flight.departureTimezoneName), 'p');
const departureTimezoneName = flight.departureTimezoneName;
const arrivalAirportCode = flight.arrivalAirport ? flight.arrivalAirport.code : null;
const arrivalDate = format(utcToZonedTime(flight.arrivalTimestamp, flight.arrivalTimezoneName), 'EEE, MMM d, yyyy');
const arrivalTime = format(utcToZonedTime(flight.arrivalTimestamp, flight.arrivalTimezoneName), 'p');
const arrivalTimezoneName = flight.arrivalTimezoneName;
const duration = intervalToDuration({
  start: new Date(flight.departureTimestamp),
  end: new Date(flight.arrivalTimestamp),
});

/* Refresh data in case just edited */
refreshNuxtData();
</script>

<template>
  <div>
    <NuxtLink v-bind:to="/trips/ + tripId" class="block first:text-slate-300 text-sm uppercase">&larr; Trip</NuxtLink>

    <PageTitle add-class="inline-block mr-2">{{ airlineName }} {{ flightDesignator }}</PageTitle>
    <DeleteButton itemType="flight" v-bind:itemId="route.params.id" />
    <NuxtLink v-bind:to="'/flights/' + route.params.id + '-edit'">
      <span class="material-icons pr-2 !text-xl text-gray-500">edit</span>
    </NuxtLink>

    <div class="flex items-center">
      <div class="flex-1">
        <span class="block text-sm">{{ departureDate }}</span>
        <span class="block text-3xl">{{ departureTime }}</span>
        <span class="block text-gray-500 text-xs">{{ departureTimezoneName }}</span>
        <span class="block text-2xl">{{ departureAirportCode }}</span>
      </div>
      <div>
        <span class="text-gray-500 text-sm">{{ duration.days ? duration.days + 'd' : '' }} {{ duration.hours ? duration.hours + 'h' : '' }} {{ duration.minutes ? duration.minutes + 'm' : '' }}</span>
      </div>
      <div class="flex-1 text-right">
        <span class="block text-sm">{{ arrivalDate }}</span>
        <span class="block text-3xl">{{ arrivalTime }}</span>
        <span class="block text-gray-500 text-xs">{{ arrivalTimezoneName }}</span>
        <span class="block text-2xl">{{ arrivalAirportCode }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
