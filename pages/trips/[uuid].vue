<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

const addMenuVisible = ref(false);
const mapLoaded = ref(false);
const mapVisible = ref(false);
const name = ref(null);

const {
  data: trip,
  pending,
  refresh,
  error,
} = await useFetch(`/api/trips/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

/**
 * Keep track of whether map has been already loaded to reduce render count
 */
function toggleMap() {
  if (!mapLoaded.value) {
    mapLoaded.value = true;
  }

  mapVisible.value = !mapVisible.value;
}

watch(trip, () => {
  name.value = trip.value.name;

  useHead({
    title: trip.value.name,
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
        <NuxtLink to="/trips" class="float-left text-gray-300 text-sm uppercase hover:text-gray-400">&larr; Trips</NuxtLink>

        <PageTitle add-class="clear-left float-left mr-2">{{ name }}</PageTitle>

        <DeleteButton itemType="trip" v-bind:itemUuid="route.params.uuid" add-class="float-left" />
        <NuxtLink v-bind:to="'/trips/' + route.params.uuid + '-edit'" class="float-left">
          <span class="material-icons !text-xl text-gray-500 hover:text-gray-600">edit</span>
        </NuxtLink>

        <div class="float-right">
          <NuxtLink v-on:click="toggleMap" class="cursor-pointer" title="Toggle Map">
            <span class="material-icons-outlined pr-2 !text-xl text-gray-500 hover:text-gray-600">map</span>
          </NuxtLink>

          <div class="inline relative">
            <NuxtLink v-on:click="addMenuVisible = !addMenuVisible" class="cursor-pointer">
              <span class="material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">add</span>
            </NuxtLink>

            <Transition>
              <ul v-if="addMenuVisible" class="inline-block bg-white py-2 absolute rounded shadow-md top-8 right-0 z-10 w-max">
                <li>
                  <NuxtLink v-bind:to="'/trips/' + route.params.uuid + '-addflight'" class="block pl-4 pr-6 py-1 hover:bg-gray-50">
                    <span class="material-icons pr-2 !text-xl text-gray-400">flight</span>
                    <span class="inline-block align-top mt-1.5 text-gray-500 text-sm">Flight</span>
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink v-bind:to="'/trips/' + route.params.uuid + '-addstay'" class="block pl-4 pr-6 py-1 hover:bg-gray-50">
                    <span class="material-icons pr-2 !text-xl text-gray-400">bed</span>
                    <span class="inline-block align-top mt-1 text-gray-500 text-sm z-10">Stay</span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </div>

          <!-- Scrim -->
          <div v-if="addMenuVisible" v-on:click="addMenuVisible = !addMenuVisible" class="absolute top-0 right-0 bottom-0 left-0"></div>
        </div>
      </header>

      <main class="clear-both flex items-stretch">
        <div v-bind:class="{ 'flex-1': !mapVisible, 'flex-0 mr-4': mapVisible }">
          <!-- Blank state -->
          <div v-if="Object.keys(trip.events).length === 0" class="p-6 rounded-lg text-center text-gray-500">
            <span class="material-icons-outlined pr-2 !text-[200px] text-gray-200">map</span>

            <p class="mb-4">What a boring trip. Why don't you add a flight or stay?</p>

            <NuxtLink v-bind:to="'/trips/' + route.params.uuid + '-addflight'">
                <button type="button" class="inline-flex justify-center mr-2 py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="material-icons pr-2 !text-xl text-white">flight</span>
                <span class="mt-0.5">Flight</span>
              </button>
            </NuxtLink>
            
            <NuxtLink v-bind:to="'/trips/' + route.params.uuid + '-addstay'">
              <button type="button" class="inline-flex justify-center ml-2 py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="material-icons pr-2 !text-xl text-white">bed</span>
                <span class="mt-0.5">Stay</span>
              </button>
            </NuxtLink>
          </div>

          <ul>
            <li v-for="(group, date) in trip.events">
              <h2 class="font-bold text-2xl">{{ format(utcToZonedTime(date, group[0].indexTimezoneName), 'EEEE, LLLL d, yyyy') }}</h2>

              <ul>
                <li v-for="event in group">
                  <NuxtLink v-if="event.type === 'flight'" v-bind:to="/flights/ + event.uuid">
                    <FlightCard v-bind:airline="event.airline" v-bind:flightNumber="event.flightNumber" v-bind:departureAirport="event.departureAirport.code" v-bind:departureTimestamp="event.departureTimestamp" v-bind:departureTimezoneName="event.departureTimezoneName" v-bind:arrivalAirport="event.arrivalAirport.code" v-bind:arrivalTimestamp="event.arrivalTimestamp" v-bind:arrivalTimezoneName="event.arrivalTimezoneName" />
                  </NuxtLink>
                  <NuxtLink v-if="event.type === 'checkin' || event.type === 'checkout'" v-bind:to="/stays/ + event.uuid">
                    <StayCard v-bind:type="event.type" v-bind:name="event.name" v-bind:address="event.address" v-bind:timestamp="event.indexTimestamp" v-bind:timezoneName="event.indexTimezoneName" />
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div v-if="mapLoaded" v-bind:class="{'max-w-full opacity-100': mapVisible, 'max-w-0 opacity-0': !mapVisible}" class="flex-1 transition-all">
          <Map v-bind:geojson="trip.geojson" />
        </div>
      </main>
    </div>
  </Transition>
</template>

<style scoped></style>
