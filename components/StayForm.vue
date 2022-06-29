<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import 'material-icons/iconfont/material-icons.css';

const { $supabase, $timezones } = useNuxtApp();

// Get current session
const session = $supabase.auth.session();

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
  }

  if (props.initialName) {
    return props.initialName;
  }

  return null;
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
  }

  if (props.initialAddress) {
    return props.initialAddress;
  }

  return null;
});
const latitude = computed(() => {
  if (location.value) {
    return location.value.geometry.coordinates[1];
  }

  if (props.initialLatitude) {
    return props.initialLatitude;
  }

  return null;
});
const longitude = computed(() => {
  if (location.value) {
    return location.value.geometry.coordinates[0];
  }

  if (props.initialLongitude) {
    return props.initialLongitude;
  }

  return null;
});

/**
 * Calculate dates and times
 */

const checkinDate = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkinTime = checkinTimestamp.value ? ref(format(utcToZonedTime(checkinTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

const checkoutDate = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'yyyy-MM-dd')) : ref(null);
const checkoutTime = checkoutTimestamp.value ? ref(format(utcToZonedTime(checkoutTimestamp.value, timezoneName.value), 'HH:mm')) : ref(null);

/**
 * Automatically set timezone
 */

watch(location, async () => {
  const { data } = await useFetch(`/api/timezones?lat=${latitude.value}&lon=${longitude.value}`);
  timezoneName.value = data.value[0];
});

/**
 * Handle form
 */

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

async function updateStay() {
  errorMessage.value = null;
  loading.value = true;

  // Check required fields
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
    errorMessage.value = 'Assigned Trip, Name, Check-In Date, Check-In Time, Check-Out Date, Check-Out Time, and Timezone are required.';

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

  const headers = { Authorization: `Bearer ${session.access_token}` };

  let response = null;
  let nextPath = null;

  try {
    // If id exists, update; otherwise, create new
    if (props.stayUuid) {
      response = await $fetch(`/api/stays/${props.stayUuid}`, { method: 'put', body, headers });
      nextPath = `/stays/${props.stayUuid}`;
      successMessage.value = 'The stay has been updated!';
    } else {
      response = await $fetch('/api/stays', { method: 'post', body, headers });
      nextPath = `/stays/${response.uuid}`;
      successMessage.value = 'The stay has been created!';
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
      <Alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="updateStay">
        <div class="mb-6">
          <label class="block font-medium mb-1 text-sm">Assigned Trip</label>
          <TripSelect v-model="tripUuid" />
        </div>

        <div class="mb-4">
          <label class="block font-medium mb-1 text-sm">Name</label>
          <LocationSearch v-model="location" v-bind:initialValue="name" add-class="w-full" />
        </div>

        <div class="flex gap-4 mb-6">
          <div class="grow shrink-0">
            <Input label="Address" type="text" add-class="w-full" v-model="address" disabled />
          </div>

          <div class="grow-0 shrink">
            <label class="block font-medium mb-1 text-sm">Timezone</label>
            <select
              v-model="timezoneName"
              class="bg-white border border-gray-300 p-2 rounded-md shadow-sm
              text-gray-700 text-sm w-full disabled:bg-gray-100 disabled:text-gray-400"
              required
              disabled
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

        <div class="mb-6">
          <Input label="Confirmation Number" type="text"  v-model="confirmationNumber" />
        </div>

        <div class="flex gap-4 mb-6">
          <Input label="Check-In Date" type="date" v-model="checkinDate" required />

          <Input label="Check-In Time" type="time" v-model="checkinTime" required />
        </div>

        <div class="flex gap-4 mb-6">
          <Input label="Check-Out Date" type="date" v-model="checkoutDate" required />

          <Input
            label="Check-Out Time"
            type="time"
            add-class="w-full"
            v-model="checkoutTime"
            required
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
