<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

const route = useRoute();

let tripId,
  name,
  address,
  confirmationNumber,
  checkinTimestamp,
  checkoutTimestamp,
  timezoneName = null;

const { data: stay, pending, refresh, error } = await useFetch(`/api/stays/${route.params.id}`);

if (!error.value) {
  ({
    tripId,
    name,
    address,
    confirmationNumber,
    checkinTimestamp,
    checkoutTimestamp,
    timezoneName,
  } = stay.value);

  useHead({
    title: `Edit ${stay.value.name}`,
  });
}
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
      <NuxtLink v-bind:to="'/stays/' + route.params.id" class="text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Back</NuxtLink>

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
  </Transition>
</template>

<style scoped></style>
