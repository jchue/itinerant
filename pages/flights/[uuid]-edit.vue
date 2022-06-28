<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

let tripUuid = null;
let airline = null;
let flightNumber = null;
let departureAirport = null;
let departureTimestamp = null;
let departureTimezoneName = null;
let arrivalAirport = null;
let arrivalTimestamp = null;
let arrivalTimezoneName = null;
let confirmationNumber = null;

const {
  data: flight,
  pending,
  refresh,
  error,
} = await useFetch(`/api/flights/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

if (!error.value) {
  ({
    tripUuid,
    airline,
    flightNumber,
    departureAirport,
    departureTimestamp,
    departureTimezoneName,
    arrivalAirport,
    arrivalTimestamp,
    arrivalTimezoneName,
    confirmationNumber,
  } = flight.value);

  useHead({
    title: `Edit ${flight.value.airline.name} ${flight.value.airline.code} ${flight.value.flightNumber}`,
  });
}

// Require auth
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <Transition mode="out-in">
    <div v-if="pending">
      <Loader />
    </div>
    <div v-else-if="error">
      <NotFound />
    </div>
    <div v-else>
      <NuxtLink v-bind:to="'/flights/' + route.params.uuid" class="text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Back</NuxtLink>

      <PageTitle>Edit Flight</PageTitle>

      <FlightForm
      v-bind:flightUuid="route.params.uuid"
      v-bind:tripUuid="tripUuid"
      v-bind:initialAirline="airline"
      v-bind:initialFlightNumber="flightNumber"
      v-bind:initialDepartureAirport="departureAirport"
      v-bind:initialDepartureTimestamp="departureTimestamp"
      v-bind:initialDepartureTimezoneName="departureTimezoneName"
      v-bind:initialArrivalAirport="arrivalAirport"
      v-bind:initialArrivalTimestamp="arrivalTimestamp"
      v-bind:initialArrivalTimezoneName="arrivalTimezoneName"
      v-bind:initialConfirmationNumber="confirmationNumber" />
    </div>
  </Transition>
</template>

<style scoped></style>
