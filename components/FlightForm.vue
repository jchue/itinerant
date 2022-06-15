<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import 'material-icons/iconfont/material-icons.css';

const route = useRoute();

/* Get lookups */

const { data: airlines } = await useFetch('/api/airlines');
const { data: airports } = await useFetch('/api/airports');
const { $timezones } = useNuxtApp();
const timezones = $timezones();

const { data: trips } = await useFetch('/api/trips');

/* Get any initialized props */

const props = defineProps([
  'flightId',
  'tripId',
  'initialAirline',
  'initialFlightNumber',
  'initialDepartureAirport',
  'initialDepartureTimestamp',
  'initialDepartureTimezoneName',
  'initialArrivalAirport',
  'initialArrivalTimestamp',
  'initialArrivalTimezoneName',
  'initialConfirmationNumber',
]);

const tripId = ref(props.tripId || null);
const airline = ref(props.initialAirline || null);
const flightNumber  = ref(props.initialFlightNumber || null);
const departureAirport = ref(props.initialDepartureAirport || null);
const departureTimestamp = ref(props.initialDepartureTimestamp || null);
const departureTimezoneName = ref(props.initialDepartureTimezoneName || null);
const arrivalAirport = ref(props.initialArrivalAirport || null);
const arrivalTimestamp = ref(props.initialArrivalTimestamp || null);
const arrivalTimezoneName = ref(props.initialArrivalTimezoneName || null);
const confirmationNumber = ref(props.initialConfirmationNumber || null);

/* Calculate dates and times */

const departureDate = departureTimestamp.value ? ref(format(utcToZonedTime(departureTimestamp.value, departureTimezoneName.value), 'yyyy-MM-dd')) : ref(null);
const departureTime = departureTimestamp.value ? ref(format(utcToZonedTime(departureTimestamp.value, departureTimezoneName.value), 'HH:mm')) : ref(null);

const arrivalDate = arrivalTimestamp.value ? ref(format(utcToZonedTime(arrivalTimestamp.value, arrivalTimezoneName.value), 'yyyy-MM-dd')) : ref(null);
const arrivalTime = arrivalTimestamp.value ? ref(format(utcToZonedTime(arrivalTimestamp.value, arrivalTimezoneName.value), 'HH:mm')) : ref(null);

/* Handle form */

let loading = ref(false);
let success = ref(false);
let error = ref(false);

async function updateFlight() {
  loading.value = true;

  /* Check required fields */
  if (
    !tripId.value
    || !airline.value
    || !flightNumber.value
    || !departureAirport.value
    || !departureDate.value
    || !departureTime.value
    || !departureTimezoneName.value
    || !arrivalAirport.value
    || !arrivalDate.value
    || !arrivalTime.value
    || !arrivalTimezoneName.value
  ) {
    loading.value = false;
    error.value = 'Assigned Trip, Airline, Flight Number, Departure Airport, Departure Date, Departure Time, Departure Timezone, Arrival Airport, Arrival Date, Arrival Time, and Arrival Timezone are required.';

    return;
  }

  const body = {
    tripId: parseInt(tripId.value),
    airline: {
      code: airline.value.code,
    },
    flightNumber: flightNumber.value,
    departureAirport: {
      code: departureAirport.value.code,
    },
    departureTimestamp: zonedTimeToUtc(`${departureDate.value} ${departureTime.value}`, departureTimezoneName.value),
    departureTimezoneName: departureTimezoneName.value,
    arrivalAirport: {
      code: arrivalAirport.value.code,
    },
    arrivalTimestamp: zonedTimeToUtc(`${arrivalDate.value} ${arrivalTime.value}`, arrivalTimezoneName.value),
    arrivalTimezoneName: arrivalTimezoneName.value,
    confirmationNumber: confirmationNumber.value,
  };

  let response = null;
  let nextPath = null;

  try {
    /* If id exists, update; otherwise, create new */
    if (props.flightId) {
      response = await $fetch(`/api/flights/${props.flightId}`, { method: 'put', body });
      nextPath = `/flights/${props.flightId}`;
    } else {
      response = await $fetch(`/api/flights`, { method: 'post', body });
      nextPath = `/flights/${response.id}`;
    }

    success.value = 'The flight has been updated!';
  } catch (error) {
    error.value = 'Uh oh, something went wrong. Please try again later.';
  }

  loading.value = false;

  await navigateTo({
    path: nextPath,
  });
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="updateFlight">
      <div class="mb-6">
        <label class="block font-medium mb-1 text-sm">Assigned Trip</label>
        <select v-model="tripId" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full" required>
          <option v-for="trip in trips" v-bind:value="trip.id">
          {{ trip.name }} ({{ trip.start ? format(utcToZonedTime(trip.start.timestamp, trip.start.timezoneName), 'MMM do') : null }} - {{ trip.end ? format(utcToZonedTime(trip.end.timestamp, trip.end.timezoneName), 'MMM do') : null }})</option>
        </select>
      </div>

      <div class="flex gap-4 mb-6">
        <div>
          <label class="block font-medium mb-1 text-sm">Airline</label>
          <select v-model="airline" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full" required>
            <option v-for="airline in airlines" v-bind:value="airline">{{ airline.name }} ({{ airline.code }})</option>
          </select>
        </div>

        <Input label="Flight Number" type="text" size="4" add-class="w-auto" v-model="flightNumber" required />
      </div>

      <fieldset class="mb-6">
        <legend class="font-bold mb-4">Departure</legend>

        <div class="mb-4">
          <label class="block font-medium mb-1 text-sm">Airport</label>
          <select v-model="departureAirport" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm" required>
            <option v-for="airport in airports" v-bind:value="airport">{{ airport.code }} - {{ airport.name }}</option>
          </select>
        </div>

        <div class="flex gap-4">
          <Input label="Date" type="date" v-model="departureDate" required />

          <Input label="Time" type="time" v-model="departureTime" required />

          <div>
            <label class="block font-medium mb-1 text-sm">Timezone</label>
            <select v-model="departureTimezoneName" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full" required>
              <option v-for="timezone in timezones" v-bind:value="timezone.name">GMT {{ timezone.offset }} {{ timezone.name }}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="mb-6">
        <legend class="font-bold mb-4">Arrival</legend>

        <div class="mb-4">
          <label class="block font-medium mb-1 text-sm">Airport</label>
          <select v-model="arrivalAirport" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm" required>
            <option v-for="airport in airports" v-bind:value="airport">{{ airport.code }} - {{ airport.name }}</option>
        </select>
        </div>

        <div class="flex gap-4">
          <Input label="Date" type="date" v-model="arrivalDate" required />

          <Input label="Time" type="time" v-model="arrivalTime" required />

          <div>
            <label class="block font-medium mb-1 text-sm">Timezone</label>
            <select v-model="arrivalTimezoneName" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full" required>
              <option v-for="timezone in timezones" v-bind:value="timezone.name">GMT {{ timezone.offset }} {{ timezone.name }}</option>
            </select>
          </div>
        </div>
      </fieldset>

      <Input label="Confirmation Number" type="text" size="6" add-class="mb-6" v-model="confirmationNumber" />

      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>

      <Loader v-if="loading" />

      <Alert v-else-if="success" type="success">
        {{ success }}
      </Alert>

      <Alert v-else-if="error" type="error">
        {{ error }}
      </Alert>
    </form>
  </div>
</template>

<style scoped></style>
