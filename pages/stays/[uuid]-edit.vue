<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

let tripUuid = null;
let name = null;
let address = null;
let latitude = null;
let longitude = null;
let confirmationNumber = null;
let checkinTimestamp = null;
let checkoutTimestamp = null;
let timezoneName = null;

const {
  data: stay,
  pending,
  error,
} = await useFetch(`/api/stays/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

if (!error.value) {
  ({
    tripUuid,
    name,
    address,
    latitude,
    longitude,
    confirmationNumber,
    checkinTimestamp,
    checkoutTimestamp,
    timezoneName,
  } = stay.value);

  useHead({
    title: `Edit ${stay.value.name}`,
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
      <header class="mb-6">
        <NuxtLink
          v-bind:to="'/stays/' + route.params.uuid"
          class="text-gray-300 text-sm uppercase hover:text-gray-400"
        >
          &larr; Back
        </NuxtLink>

        <PageTitle>Edit Stay</PageTitle>
      </header>

      <StayForm
        v-bind:stayUuid="route.params.uuid"
        v-bind:tripUuid="tripUuid"
        v-bind:initialName="name"
        v-bind:initialAddress="address"
        v-bind:initialLatitude="latitude"
        v-bind:initialLongitude="longitude"
        v-bind:initialConfirmationNumber="confirmationNumber"
        v-bind:initialCheckinTimestamp="checkinTimestamp"
        v-bind:initialCheckoutTimestamp="checkoutTimestamp"
        v-bind:initialTimezoneName="timezoneName"
      />
    </div>
  </Transition>
</template>

<style scoped></style>
