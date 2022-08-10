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
  error,
} = await useFetch(`/api/flights/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

watch(flight, () => {
  tripUuid.value = flight.value.tripUuid;
  airlineName.value = flight.value.airline ? flight.value.airline.name : null;
  flightDesignator.value = flight.value.airline ? `${flight.value.airline.code} ${flight.value.flightNumber}` : null;
  departureAirportCode.value = flight.value.departureAirport ? flight.value.departureAirport.code : null;
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
      <header class="mb-6">
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
            {{ airlineName }} {{ flightDesignator }}
          </PageTitle>

          <DeleteButton
            itemType="flight"
            v-bind:itemUuid="route.params.uuid"
            v-bind:tripUuid="tripUuid"
            add-class="float-left"
          />

          <NuxtLink v-bind:to="'/flights/' + route.params.uuid + '-edit'" class="float-left">
            <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">edit</span>
          </NuxtLink>
        </div>
      </header>

      <main>
        <div class="flex items-center mb-8">

          <div>
            <span class="text-gray-600 text-xs uppercase">Depart</span>
            <span class="block text-emerald-700 text-sm">{{ departureDate }}</span>
            <div>
              <div class="align-top inline-block mr-4">
                <span class="block font-bold -mb-1 text-emerald-700 text-2xl">
                  {{ departureTime }}
                </span>
                <span class="block text-gray-600 text-[0.625rem]">{{ departureTimezoneName }}</span>
              </div>
              <div class="align-top inline-block">
                <span class="block font-light text-gray-600 text-2xl">
                  {{ departureAirportCode }}
                </span>
              </div>
            </div>
          </div>

          <div class="px-32 text-center">
            <span class="font-light text-gray-500 text-sm">
              {{ duration.days ? duration.days + 'd' : '' }} {{ duration.hours ? duration.hours + 'h' : '' }} {{ duration.minutes ? duration.minutes + 'm' : '' }}
            </span>
          </div>

          <div>
            <span class="text-gray-600 text-xs uppercase">Arrive</span>
            <span class="block text-emerald-700 text-sm">{{ arrivalDate }}</span>
            <div>
              <div class="align-top inline-block mr-4">
                <span class="block font-bold -mb-1 text-emerald-700 text-2xl">
                  {{ arrivalTime }}
                </span>
                <span class="block text-gray-600 text-[0.625rem]">{{ arrivalTimezoneName }}</span>
              </div>
              <div class="align-top inline-block">
                <span class="block font-light text-gray-600 text-2xl">
                  {{ arrivalAirportCode }}
                </span>
              </div>
            </div>
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
