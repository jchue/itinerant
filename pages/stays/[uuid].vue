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
      <header class="mb-4">
        <div>
          <NuxtLink
            v-bind:to="/trips/ + tripUuid"
            class="text-gray-300 text-sm uppercase hover:text-gray-400"
          >
            &larr; Trip
          </NuxtLink>
        </div>
        <div class="flex items-center">
          <PageTitle add-class="mr-2">
            {{ name }}
          </PageTitle>

          <DeleteButton
            itemType="stay"
            v-bind:itemUuid="route.params.uuid"
            v-bind:tripUuid="tripUuid"
            add-class="float-left"
          />

          <NuxtLink v-bind:to="'/stays/' + route.params.uuid + '-edit'" class="float-left">
            <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
          </NuxtLink>
        </div>
      </header>

      <main>
        <span class="block mb-6 font-light text-gray-600">{{ address }}</span>

        <div class="flex items-center mb-8">

          <div>
            <span class="block text-gray-600 text-xs uppercase">Check-In</span>
            <span class="block font-bold -mb-1 text-emerald-700 text-2xl">{{ checkinDate }}</span>
            <span class="block text-emerald-700 text-sm">{{ checkinTime }}</span>
            <span class="block text-gray-600 text-[0.625rem]">{{ timezoneName }}</span>
          </div>
          <div class="px-32"></div>
          <div>
            <span class="block text-gray-600 text-xs uppercase">Check-Out</span>
            <span class="block font-bold -mb-1 text-emerald-700 text-2xl">{{ checkoutDate }}</span>
            <span class="block text-emerald-700 text-sm">{{ checkoutTime }}</span>
            <span class="block text-gray-600 text-[0.625rem]">{{ timezoneName }}</span>
          </div>

        </div>

        <div>
          <span class="block text-gray-600 text-xs uppercase">Confirmation Number</span>
          <span class="font-bold">{{ confirmationNumber }}</span>
        </div>
      </main>
    </div>
  </Transition>
</template>

<style scoped></style>
