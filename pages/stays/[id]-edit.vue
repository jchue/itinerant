<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

const route = useRoute();

const stay = await $fetch(`/api/stays/${route.params.id}`);

const {
  tripId,
  name,
  address,
  confirmationNumber,
  checkinTimestamp,
  checkoutTimestamp,
  timezoneName,
} = stay;
</script>

<template>
  <div>
    <NuxtLink v-bind:to="'/stays/' + route.params.id" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>Edit Stay</PageTitle>

    <StayForm
    v-bind:stayId="route.params.id"
    v-bind:tripId="tripId"
    v-bind:initialName="name"
    v-bind:initialAddress="address"
    v-bind:initialConfirmationNumber="confirmationNumber"
    v-bind:initialCheckinTimestamp="checkinTimestamp"
    v-bind:initialCheckoutTimestamp="checkoutTimestamp"
    v-bind:initialTimezoneName="timezoneName"
    />
  </div>
</template>

<style scoped></style>
