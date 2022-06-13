<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

const route = useRoute();

const stay = await $fetch(`/api/stays/${route.params.id}`);

const tripId = stay.tripId;
const name = stay.name;
const address = stay.address;
const confirmationNumber = stay.confirmationNumber;
const checkinDate = format(utcToZonedTime(stay.checkinTimestamp, stay.timezoneName), 'EEE, MMM d, yyyy');
const checkinTime = format(utcToZonedTime(stay.checkinTimestamp, stay.timezoneName), 'p');
const checkoutDate = format(utcToZonedTime(stay.checkoutTimestamp, stay.timezoneName), 'EEE, MMM d, yyyy');
const checkoutTime = format(utcToZonedTime(stay.checkoutTimestamp, stay.timezoneName), 'p');
const timezoneName = stay.timezoneName;

/* Refresh data in case just edited */
refreshNuxtData();
</script>

<template>
  <div>
    <NuxtLink v-bind:to="/trips/ + tripId" class="block text-slate-300 text-sm uppercase">&larr; Trip</NuxtLink>

    <PageTitle add-class="inline-block mr-2">{{ name }}</PageTitle>
    <DeleteButton itemType="stay" v-bind:itemId="route.params.id" />
    <NuxtLink v-bind:to="'/stays/' + route.params.id + '-edit'">
      <span class="material-icons pr-2 !text-xl text-gray-500">edit</span>
    </NuxtLink>

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
  </div>
</template>

<style scoped></style>
