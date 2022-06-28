<script lang="ts" setup>
import { format, intervalToDuration } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

const tripUuid = ref(null);
const airlineName = ref(null);
const flightDesignator = ref(null);
const departureAirportCode = ref(null);
const departureDate = ref(null);
const departureTime = ref(null);
const departureTimezoneName = ref(null);
const arrivalAirportCode = ref(null);
const arrivalDate = ref(null);
const arrivalTime = ref(null);
const arrivalTimezoneName = ref(null);
const duration = ref(null);
const confirmationNumber = ref(null);

const {
  data: flight,
  pending,
  refresh,
  error
} = await useFetch(`/api/flights/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

watch(flight, () => {
  tripUuid.value = flight.value.tripUuid;
  airlineName.value = flight.value.airline ? flight.value.airline.name : null;
  flightDesignator.value = flight.value.airline ? `${flight.value.airline.code} ${flight.value.flightNumber}` : null;
  departureAirportCode.value = flight.value.departureAirport? flight.value.departureAirport.code : null;
  departureDate.value = format(utcToZonedTime(flight.value.departureTimestamp, flight.value.departureTimezoneName), 'EEE, MMM d, yyyy');
  departureTime.value = format(utcToZonedTime(flight.value.departureTimestamp, flight.value.departureTimezoneName), 'p');
  departureTimezoneName.value = flight.value.departureTimezoneName;
  arrivalAirportCode.value = flight.value.arrivalAirport ? flight.value.arrivalAirport.code : null;
  arrivalDate.value = format(utcToZonedTime(flight.value.arrivalTimestamp, flight.value.arrivalTimezoneName), 'EEE, MMM d, yyyy');
  arrivalTime.value = format(utcToZonedTime(flight.value.arrivalTimestamp, flight.value.arrivalTimezoneName), 'p');
  arrivalTimezoneName.value = flight.value.arrivalTimezoneName;
  duration.value = intervalToDuration({
    start: new Date(flight.value.departureTimestamp),
    end: new Date(flight.value.arrivalTimestamp),
  });
  confirmationNumber.value = flight.value.confirmationNumber;

  useHead({
    title: `${flight.value.airline.name} ${flight.value.airline.code} ${flight.value.flightNumber}`,
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
        <NuxtLink v-bind:to="/trips/ + tripUuid" class="float-left first:text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Trip</NuxtLink>

        <PageTitle add-class="clear-left float-left mr-2">{{ airlineName }} {{ flightDesignator }}</PageTitle>

        <DeleteButton itemType="flight" v-bind:itemUuid="route.params.uuid" v-bind:tripUuid="tripUuid" add-class="float-left" />

        <NuxtLink v-bind:to="'/flights/' + route.params.uuid + '-edit'" class="float-left">
          <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
        </NuxtLink>
      </header>

      <main class="clear-both">
        <span class="block mb-2">Confirmation Number: {{ confirmationNumber }}</span>

        <div class="flex items-center">
          <div class="flex-1">
            <span class="block text-sm">{{ departureDate }}</span>
            <span class="block text-3xl">{{ departureTime }}</span>
            <span class="block text-gray-500 text-xs">{{ departureTimezoneName }}</span>
            <span class="block text-2xl">{{ departureAirportCode }}</span>
          </div>
          <div>
            <span class="text-gray-500 text-sm">{{ duration.days ? duration.days + 'd' : '' }} {{ duration.hours ? duration.hours + 'h' : '' }} {{ duration.minutes ? duration.minutes + 'm' : '' }}</span>
          </div>
          <div class="flex-1 text-right">
            <span class="block text-sm">{{ arrivalDate }}</span>
            <span class="block text-3xl">{{ arrivalTime }}</span>
            <span class="block text-gray-500 text-xs">{{ arrivalTimezoneName }}</span>
            <span class="block text-2xl">{{ arrivalAirportCode }}</span>
          </div>
        </div>
      </main>
    </div>
  </Transition>
</template>

<style scoped></style>
