<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

const tripUuid = ref(null);
const name = ref(null);
const address = ref(null);
const confirmationNumber = ref(null);
const checkinDate = ref(null);
const checkinTime = ref(null);
const checkoutDate = ref(null);
const checkoutTime = ref(null);
const timezoneName = ref(null);

const {
  data: stay,
  pending,
  refresh,
  error,
} = await useFetch(`/api/stays/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

watch(stay, () => {
  tripUuid.value = stay.value.tripUuid;
  name.value = stay.value.name;
  address.value = stay.value.address;
  confirmationNumber.value = stay.value.confirmationNumber;
  checkinDate.value = format(utcToZonedTime(stay.value.checkinTimestamp, stay.value.timezoneName), 'EEE, MMM d, yyyy');
  checkinTime.value = format(utcToZonedTime(stay.value.checkinTimestamp, stay.value.timezoneName), 'p');
  checkoutDate.value = format(utcToZonedTime(stay.value.checkoutTimestamp, stay.value.timezoneName), 'EEE, MMM d, yyyy');
  checkoutTime.value = format(utcToZonedTime(stay.value.checkoutTimestamp, stay.value.timezoneName), 'p');
  timezoneName.value = stay.value.timezoneName;

  useHead({
    title: stay.value.name,
  });
});

// Require auth
definePageMeta({
  middleware: ['auth'],
});

refresh();
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
      <header>
        <NuxtLink
          v-bind:to="/trips/ + tripUuid"
          class="float-left text-gray-300 text-sm uppercase hover:text-gray-400"
        >
          &larr; Trip
        </NuxtLink>

        <PageTitle add-class="clear-left float-left mr-2">{{ name }}</PageTitle>

        <DeleteButton
          itemType="stay"
          v-bind:itemUuid="route.params.uuid"
          v-bind:tripUuid="tripUuid"
          add-class="float-left"
        />

        <NuxtLink v-bind:to="'/stays/' + route.params.uuid + '-edit'" class="float-left">
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
  </Transition>
</template>

<style scoped></style>
