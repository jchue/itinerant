<script lang="ts" setup>
const route = useRoute();

const { data: { value: flight }} = await useFetch(`/api/flights/${route.params.id}`);

const {
  tripId,
  airline,
  flightNumber,
  departureAirport,
  departureTimestamp,
  departureTimezoneName,
  arrivalAirport,
  arrivalTimestamp,
  arrivalTimezoneName
} = flight;
</script>

<template>
  <div>
    <NuxtLink v-bind:to="'/flights/' + route.params.id" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

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
</template>

<style scoped></style>
