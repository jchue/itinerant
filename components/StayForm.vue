<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import 'material-icons/iconfont/material-icons.css';

const route = useRoute();

/* Get lookups */

const { $timezones } = useNuxtApp();
const timezones = $timezones();

const { data: trips } = await useFetch('/api/trips');

/* Get any initialized props */

const props = defineProps([
  'stayId',
  'tripId',
  'initialName',
  'initialAddress',
  'initialConfirmationNumber',
  'initialCheckinTimestamp',
  'initialCheckoutTimestamp',
  'initialTimezoneName',
]);

const tripId = ref(props.tripId || null);
const name = ref(props.initialName || null);
const address = ref(props.initialAddress || null);
const confirmationNumber = ref(props.initialConfirmationNumber || null);
const checkinTimestamp = ref(props.initialCheckinTimestamp || null);
const checkoutTimestamp = ref(props.initialCheckoutTimestamp || null);
const timezoneName = ref(props.initialTimezoneName) || null;

/* Calculate dates and times */

const checkinDate = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkinTime = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

const checkoutDate = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkoutTime = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

/* Handle form */

let loading = ref(false);
let success = ref(false);

async function updateStay() {
  loading.value = true;

  const body = {
    tripId: parseInt(tripId.value),
    name: name.value,
    address: address.value,
    confirmationNumber: confirmationNumber.value,
    checkinTimestamp: zonedTimeToUtc(`${checkinDate.value} ${checkinTime.value}`, timezoneName.value),
    checkoutTimestamp: zonedTimeToUtc(`${checkoutDate.value} ${checkoutTime.value}`, timezoneName.value),
    timezoneName: timezoneName.value,
  };

  let response = null;
  let nextPath = null;

  try {
    /* If id exists, update; otherwise, create new */
    if (props.stayId) {
      response = await $fetch(`/api/stays/${props.stayId}`, { method: 'put', body });
      nextPath = `/stays/${props.stayId}`;
    } else {
      response = await $fetch(`/api/stays`, { method: 'post', body });
      nextPath = `/stays/${response.id}`;
    }

    success.value = true;
  } catch (error) {
    success.value = false;
  }

  loading.value = false;

  navigateTo({
    path: nextPath,
  });
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="updateStay">
      <div class="mb-6">
        <label class="block font-medium mb-1 text-sm">Assigned Trip</label>
        <select v-model="tripId" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full">
          <option v-for="trip in trips" v-bind:value="trip.id">
          {{ trip.name }} ({{ trip.start ? format(utcToZonedTime(trip.start.timestamp, trip.start.timezoneName), 'MMM do') : null }} - {{ trip.end ? format(utcToZonedTime(trip.end.timestamp, trip.end.timezoneName), 'MMM do') : null }})</option>
        </select>
      </div>

      <div class="mb-4">
        <Input label="Name" type="text" add-class="w-full" v-model="name" />
      </div>

      <div class="mb-4">
        <Input label="Address" type="text" add-class="w-full" v-model="address" />
      </div>

      <div class="mb-6">
        <Input label="Confirmation Number" type="text"  v-model="confirmationNumber" />
      </div>

      <div class="flex gap-4 mb-6">
        <Input label="Check-In Date" type="date" v-model="checkinDate" />

        <Input label="Check-In Time" type="time" v-model="checkinTime" />
      </div>

      <div class="flex gap-4 mb-6">
        <Input label="Check-Out Date" type="date" v-model="checkoutDate" />

        <Input label="Check-Out Time" type="time" add-class="w-full" v-model="checkoutTime" />
      </div>

      <div class="mb-6">
        <label class="block font-medium mb-1 text-sm">Timezone</label>
        <select v-model="timezoneName" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm">
          <option v-for="timezone in timezones" v-bind:value="timezone.name">GMT {{ timezone.offset }} {{ timezone.name }}</option>
        </select>
      </div>

      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>

      <span v-if="loading">Loading...</span>
      <div v-else-if="success" class="bg-green-50 p-4 rounded">
        <div class="inline-block align-top">
          <span class="material-icons pr-2 !text-xl text-green-300">check_circle</span>
        </div>
        <div class="inline-block">
          <span class="block text-green-900 text-sm">Success</span>
          <span class="block text-green-700 text-sm">The stay has been updated!</span>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
