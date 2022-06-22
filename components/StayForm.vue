<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import 'material-icons/iconfont/material-icons.css';

const route = useRoute();

/**
 * Get lookups
 */

const { $timezones } = useNuxtApp();
const timezones = $timezones();

const { data: trips } = await useFetch('/api/trips');

/**
 * Get any initialized props
 */

const props = defineProps([
  'stayUuid',
  'tripUuid',
  'initialName',
  'initialAddress',
  'initialLatitude',
  'initialLongitude',
  'initialConfirmationNumber',
  'initialCheckinTimestamp',
  'initialCheckoutTimestamp',
  'initialTimezoneName',
]);

const tripUuid = ref(props.tripUuid || null);
const confirmationNumber = ref(props.initialConfirmationNumber || null);
const checkinTimestamp = ref(props.initialCheckinTimestamp || null);
const checkoutTimestamp = ref(props.initialCheckoutTimestamp || null);
const timezoneName = ref(props.initialTimezoneName || null);
const location = ref(null);
const name = computed(() => {
  if (location.value) {
    return location.value.properties.name;
  } else if (props.initialName) {
    return props.initialName;
  } else {
    return null;
  }
});
const address = computed(() => {
  if (location.value) {
    const houseNumber = location.value.properties.housenumber ? `${location.value.properties.housenumber} ` : '';
    const street = location.value.properties.street ? `${location.value.properties.street}, ` : '';
    const city = location.value.properties.city ? `${location.value.properties.city}, ` : '';
    const state = location.value.properties.state ? `${location.value.properties.state}` : '';
    const postCode = location.value.properties.postcode ? ` ${location.value.properties.postcode}` : '';
    const country = location.value.properties.country ? `, ${location.value.properties.country}` : '';

    return houseNumber + street + city + state + postCode + country;
  } else if (props.initialAddress) {
    return props.initialAddress;
  } else {
    return null;
  }
});
const latitude = computed(() => {
  if (location.value) {
    return location.value.geometry.coordinates[1];
  } else if (props.initialLatitude) {
    return props.initialLatitude;
  } else {
    return null;
  }
});
const longitude = computed(() => {
  if (location.value) {
    return location.value.geometry.coordinates[0];
  } else if (props.initialLongitude) {
    return props.initialLongitude;
  } else {
    return null;
  }
});

/**
 * Calculate dates and times
 */

const checkinDate = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkinTime = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

const checkoutDate = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkoutTime = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

/**
 * Handle form
 */

let loading = ref(false);
let success = ref(false);
let error = ref(false);

async function updateStay() {
  loading.value = true;

  /* Check required fields */
  if (
    !tripUuid.value
    || !name.value
    || !checkinDate.value
    || !checkinTime.value
    || !checkoutDate.value
    || !checkoutTime.value
    || !timezoneName.value
  ) {
    loading.value = false;
    error.value = 'Assigned Trip, Name, Check-In Date, Check-In Time, Check-Out Date, Check-Out Time, and Timezone are required.';

    return;
  }

  const body = {
    tripUuid: tripUuid.value,
    name: name.value,
    address: address.value,
    latitude: latitude.value,
    longitude: longitude.value,
    confirmationNumber: confirmationNumber.value,
    checkinTimestamp: zonedTimeToUtc(`${checkinDate.value} ${checkinTime.value}`, timezoneName.value),
    checkoutTimestamp: zonedTimeToUtc(`${checkoutDate.value} ${checkoutTime.value}`, timezoneName.value),
    timezoneName: timezoneName.value,
  };

  let response = null;
  let nextPath = null;

  try {
    // If id exists, update; otherwise, create new
    if (props.stayUuid) {
      response = await $fetch(`/api/stays/${props.stayUuid}`, { method: 'put', body });
      nextPath = `/stays/${props.stayUuid}`;
      success.value = 'The stay has been updated!';
    } else {
      response = await $fetch(`/api/stays`, { method: 'post', body });
      nextPath = `/stays/${response.uuid}`;
      success.value = 'The stay has been created!';
    }

    loading.value = false;

    await navigateTo({
      path: nextPath,
    });
  } catch (e) {
    loading.value = false;
    error.value = 'Uh oh, something went wrong. Please try again later.';
  }
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="updateStay">
      <div class="mb-6">
        <label class="block font-medium mb-1 text-sm">Assigned Trip</label>
        <TripSelect v-model="tripUuid" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1 text-sm">Name</label>
        <LocationSearch v-model="location" v-bind:initialValue="name" add-class="w-full" />
      </div>

      <div class="mb-4">
        <Input label="Address" type="text" add-class="w-full" v-model="address" disabled />
      </div>

      <div class="mb-6">
        <Input label="Confirmation Number" type="text"  v-model="confirmationNumber" />
      </div>

      <div class="flex gap-4 mb-6">
        <Input label="Check-In Date" type="date" v-model="checkinDate" required />

        <Input label="Check-In Time" type="time" v-model="checkinTime" required />
      </div>

      <div class="flex gap-4 mb-6">
        <Input label="Check-Out Date" type="date" v-model="checkoutDate" required />

        <Input label="Check-Out Time" type="time" add-class="w-full" v-model="checkoutTime" required />
      </div>

      <div class="mb-6">
        <label class="block font-medium mb-1 text-sm">Timezone</label>
        <select v-model="timezoneName" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm" required>
          <option v-for="timezone in timezones" v-bind:value="timezone.name">GMT {{ timezone.offset }} {{ timezone.name }}</option>
        </select>
      </div>

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
