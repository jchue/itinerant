<script lang="ts" setup>
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

/* Refresh data in case just edited */
refreshNuxtData();

const route = useRoute();

let tripId, airlineName, flightDesignator, departureAirportCode, departureDate, departureTime, departureTimezoneName, arrivalAirportCode, arrivalDate, arrivalTime, arrivalTimezoneName, duration = null;

const { data: flight, pending, refresh, error } = await useFetch(`/api/flights/${route.params.id}`);

if (!error.value) {
  tripId = flight.value.tripId;
  airlineName = flight.value.airline ? flight.value.airline.name : null;
  flightDesignator = flight.value.airline ? `${flight.value.airline.code} ${flight.value.flightNumber}` : null;
  departureAirportCode = flight.value.departureAirport? flight.value.departureAirport.code : null;
  departureDate = format(utcToZonedTime(flight.value.departureTimestamp, flight.value.departureTimezoneName), 'EEE, MMM d, yyyy');
  departureTime = format(utcToZonedTime(flight.value.departureTimestamp, flight.value.departureTimezoneName), 'p');
  departureTimezoneName = flight.value.departureTimezoneName;
  arrivalAirportCode = flight.value.arrivalAirport ? flight.value.arrivalAirport.code : null;
  arrivalDate = format(utcToZonedTime(flight.value.arrivalTimestamp, flight.value.arrivalTimezoneName), 'EEE, MMM d, yyyy');
  arrivalTime = format(utcToZonedTime(flight.value.arrivalTimestamp, flight.value.arrivalTimezoneName), 'p');
  arrivalTimezoneName = flight.value.arrivalTimezoneName;
  duration = intervalToDuration({
    start: new Date(flight.value.departureTimestamp),
    end: new Date(flight.value.arrivalTimestamp),
  });

  useHead({
    title: `${flight.value.airline.name} ${flight.value.airline.code} ${flight.value.flightNumber}`,
  });
}
</script>

<template>
  <div>
    <div v-if="pending">
      <Loader />
    </div>
    <div v-else-if="error">
      <NotFound />
    </div>
    <div v-else>
      <header>
        <NuxtLink v-bind:to="/trips/ + tripId" class="float-left first:text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Trip</NuxtLink>

        <PageTitle add-class="clear-left float-left mr-2">{{ airlineName }} {{ flightDesignator }}</PageTitle>

        <DeleteButton itemType="flight" v-bind:itemId="route.params.id" add-class="float-left" />

        <NuxtLink v-bind:to="'/flights/' + route.params.id + '-edit'" class="float-left">
          <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
        </NuxtLink>
      </header>

      <main class="clear-both">
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
      </main>
    </div>
  </div>
</template>

<style scoped></style>
