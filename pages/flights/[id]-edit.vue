<script lang="ts" setup>
const route = useRoute();

let tripId,
    airline,
    flightNumber,
    departureAirport,
    departureTimestamp,
    departureTimezoneName,
    arrivalAirport,
    arrivalTimestamp,
    arrivalTimezoneName = null;

const { data: flight, pending, refresh, error }  = await useFetch(`/api/flights/${route.params.id}`);

if (!error.value) {
  ({
    tripId,
    airline,
    flightNumber,
    departureAirport,
    departureTimestamp,
    departureTimezoneName,
    arrivalAirport,
    arrivalTimestamp,
    arrivalTimezoneName
  } = flight.value);

  useHead({
    title: `Edit ${flight.value.airline.name} ${flight.value.airline.code} ${flight.value.flightNumber}`,
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
      <NuxtLink v-bind:to="'/flights/' + route.params.id" class="text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Back</NuxtLink>

      <PageTitle>Edit Flight</PageTitle>

      <FlightForm
      v-bind:flightId="route.params.id"
      v-bind:tripId="tripId"
      v-bind:initialAirline="airline"
      v-bind:initialFlightNumber="flightNumber"
      v-bind:initialDepartureAirport="departureAirport"
      v-bind:initialDepartureTimestamp="departureTimestamp"
      v-bind:initialDepartureTimezoneName="departureTimezoneName"
      v-bind:initialArrivalAirport="arrivalAirport"
      v-bind:initialArrivalTimestamp="arrivalTimestamp"
      v-bind:initialArrivalTimezoneName="arrivalTimezoneName" />
    </div>
  </div>
</template>

<style scoped></style>
