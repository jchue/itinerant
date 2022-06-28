<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import 'material-icons/iconfont/material-icons.css';

const { $supabase, $timezones } = useNuxtApp();

// Get current session
const session = $supabase.auth.session();

/**
 * Get lookups
 */

const { data: airlines } = await useFetch('/api/airlines');
const { data: airports } = await useFetch('/api/airports');

/**
 * Get any initialized props
 */

const props = defineProps([
  'flightUuid',
  'tripUuid',
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

const tripUuid = ref(props.tripUuid || null);
const airline = ref(props.initialAirline || null);
const flightNumber  = ref(props.initialFlightNumber || null);
const departureAirport = ref(props.initialDepartureAirport || {});
const departureTimestamp = ref(props.initialDepartureTimestamp || null);
const departureTimezoneName = ref(props.initialDepartureTimezoneName || null);
const arrivalAirport = ref(props.initialArrivalAirport || {});
const arrivalTimestamp = ref(props.initialArrivalTimestamp || null);
const arrivalTimezoneName = ref(props.initialArrivalTimezoneName || null);
const confirmationNumber = ref(props.initialConfirmationNumber || null);

/**
 * Calculate dates and times
 */

const departureDate = departureTimestamp.value ? ref(format(utcToZonedTime(departureTimestamp.value, departureTimezoneName.value), 'yyyy-MM-dd')) : ref(null);
const departureTime = departureTimestamp.value ? ref(format(utcToZonedTime(departureTimestamp.value, departureTimezoneName.value), 'HH:mm')) : ref(null);

const arrivalDate = arrivalTimestamp.value ? ref(format(utcToZonedTime(arrivalTimestamp.value, arrivalTimezoneName.value), 'yyyy-MM-dd')) : ref(null);
const arrivalTime = arrivalTimestamp.value ? ref(format(utcToZonedTime(arrivalTimestamp.value, arrivalTimezoneName.value), 'HH:mm')) : ref(null);

/**
 * Handle form
 */

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

async function updateFlight() {
  loading.value = true;

  // Check required fields
  if (
    !tripUuid.value
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
    errorMessage.value = 'Assigned Trip, Airline, Flight Number, Departure Airport, Departure Date, Departure Time, Departure Timezone, Arrival Airport, Arrival Date, Arrival Time, and Arrival Timezone are required.';

    return;
  }

  // Check flight number format
  if (!Number.isInteger(flightNumber.value)) {
    loading.value = false;
    errorMessage.value = 'Invalid Flight Number';

    return;
  }

  const body = {
    tripUuid: tripUuid.value,
    airline: {
      code: airline.value.code,
    },
    flightNumber: parseInt(flightNumber.value, 10),
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

  const headers = { Authorization: `Bearer ${session.access_token}` };

  let response = null;
  let nextPath = null;

  try {
    // If id exists, update; otherwise, create new
    if (props.flightUuid) {
      response = await $fetch(`/api/flights/${props.flightUuid}`, { method: 'put', body, headers });
      nextPath = `/flights/${props.flightUuid}`;
      successMessage.value = 'The flight has been updated!';
    } else {
      response = await $fetch('/api/flights', { method: 'post', body, headers });
      nextPath = `/flights/${response.uuid}`;
      successMessage.value = 'The flight has been created!';
    }

    await navigateTo({
      path: nextPath,
    });
  } catch (error) {
    errorMessage.value = 'Uh oh, something went wrong. Please try again later.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error" add-class="mb-6">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="updateFlight">
        <div class="mb-6">
          <label class="block font-medium mb-1 text-sm">Assigned Trip</label>
          <TripSelect v-model="tripUuid" />
        </div>

        <div class="flex gap-4 mb-6">
          <div>
            <label class="block font-medium mb-1 text-sm">Airline</label>
            <select
              v-model="airline"
              class="bg-white border border-gray-300 p-2 rounded-md
              shadow-sm text-gray-700 text-sm w-full"
              required
            >
              <option v-for="airline in airlines" v-bind:key="airline.code" v-bind:value="airline">
                {{ airline.name }} ({{ airline.code }})
              </option>
            </select>
          </div>

          <Input
            label="Flight Number"
            type="text"
            size="6"
            add-class="w-auto"
            v-model="flightNumber"
            required
          />
        </div>

        <fieldset class="mb-6">
          <legend class="font-bold mb-4">Departure</legend>

          <div class="mb-4">
            <label class="block font-medium mb-1 text-sm">Airport</label>
            <select
              v-model="departureAirport.code"
              class="bg-white border border-gray-300 p-2 rounded-md
              shadow-sm text-gray-700 text-sm w-full"
              required
            >
              <option
                v-for="airport in airports"
                v-bind:key="airport.code"
                v-bind:value="airport.code"
              >
                {{ airport.code }} - {{ airport.name }}
              </option>
            </select>
          </div>

          <div class="flex gap-4">
            <Input label="Date" type="date" v-model="departureDate" required />

            <Input label="Time" type="time" v-model="departureTime" required />

            <div>
              <label class="block font-medium mb-1 text-sm">Timezone</label>
              <select
                v-model="departureTimezoneName"
                class="bg-white border border-gray-300 p-2 rounded-md
                shadow-sm text-gray-700 text-sm w-full"
                required
              >
                <option
                  v-for="timezone in $timezones()"
                  v-bind:key="timezone.name"
                  v-bind:value="timezone.name"
                >
                  GMT {{ timezone.offset }} {{ timezone.name }}
                </option>
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset class="mb-6">
          <legend class="font-bold mb-4">Arrival</legend>

          <div class="mb-4">
            <label class="block font-medium mb-1 text-sm">Airport</label>
            <select
              v-model="arrivalAirport.code"
              class="bg-white border border-gray-300 p-2 rounded-md
              shadow-sm text-gray-700 text-sm w-full"
              required
            >
              <option
                v-for="airport in airports"
                v-bind:key="airport.code"
                v-bind:value="airport.code"
              >
                {{ airport.code }} - {{ airport.name }}
              </option>
          </select>
          </div>

          <div class="flex gap-4">
            <Input label="Date" type="date" v-model="arrivalDate" required />

            <Input label="Time" type="time" v-model="arrivalTime" required />

            <div>
              <label class="block font-medium mb-1 text-sm">Timezone</label>
              <select
                v-model="arrivalTimezoneName"
                class="bg-white border border-gray-300 p-2 rounded-md
                shadow-sm text-gray-700 text-sm w-full"
                required
              >
                <option
                  v-for="timezone in $timezones()"
                  v-bind:key="timezone.name"
                  v-bind:value="timezone.name"
                >
                  GMT {{ timezone.offset }} {{ timezone.name }}
                </option>
              </select>
            </div>
          </div>
        </fieldset>

        <Input
          label="Confirmation Number"
          type="text"
          size="6"
          add-class="mb-6"
          v-model="confirmationNumber"
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
