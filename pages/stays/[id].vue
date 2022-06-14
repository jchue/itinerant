<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

/* Refresh data in case just edited */
refreshNuxtData();

const route = useRoute();

let tripId, name, address, confirmationNumber, checkinDate, checkinTime, checkoutDate, checkoutTime, timezoneName = null;

const { data: stay, pending, refresh, error } = await useFetch(`/api/stays/${route.params.id}`);

if (!error.value) {
  tripId = stay.value.tripId;
  name = stay.value.name;
  address = stay.value.address;
  confirmationNumber = stay.value.confirmationNumber;
  checkinDate = format(utcToZonedTime(stay.value.checkinTimestamp, stay.value.timezoneName), 'EEE, MMM d, yyyy');
  checkinTime = format(utcToZonedTime(stay.value.checkinTimestamp, stay.value.timezoneName), 'p');
  checkoutDate = format(utcToZonedTime(stay.value.checkoutTimestamp, stay.value.timezoneName), 'EEE, MMM d, yyyy');
  checkoutTime = format(utcToZonedTime(stay.value.checkoutTimestamp, stay.value.timezoneName), 'p');
  timezoneName = stay.value.timezoneName;

  useHead({
    title: stay.value.name,
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
        <NuxtLink v-bind:to="/trips/ + tripId" class="float-left text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Trip</NuxtLink>

        <PageTitle add-class="clear-left float-left mr-2">{{ name }}</PageTitle>

        <DeleteButton itemType="stay" v-bind:itemId="route.params.id" add-class="float-left" />

        <NuxtLink v-bind:to="'/stays/' + route.params.id + '-edit'" class="float-left">
          <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
        </NuxtLink>
      </header>

      <main class="clear-both">
        <span class="block mb-4">{{ address }}</span>

        <span class="block mb-2">Confirmation Number: {{ confirmationNumber }}</span>

        <div class="flex">
          <div class="flex-1">
            <span class="block text-sm">Check-In</span>
            <span class="block text-xl">{{ checkinDate }}</span>
            <span class="block text-md">{{ checkinTime }}</span>
          </div>
          <div class="flex-1 text-right">
            <span class="block text-sm">Check-Out</span>
            <span class="block text-xl">{{ checkoutDate }}</span>
            <span class="block text-md">{{ checkoutTime }}</span>
          </div>
        </div>

        <span class="block text-gray-500 text-xs">{{ timezoneName }}</span>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
