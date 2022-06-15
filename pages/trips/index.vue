<script lang="ts" setup>
import 'material-icons/iconfont/material-icons.css';

const { data: trips, pending, refresh, error } = await useFetch('/api/trips');

useHead({
  title: 'Trips',
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
        <span class="text-slate-300 text-sm uppercase">Trips</span>

        <NuxtLink to="/addtrip">
          <span class="float-right material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600">add</span>
        </NuxtLink>
      </header>

      <main>
        <!-- Blank state -->
        <div v-if="trips.length === 0" class="p-6 rounded-lg text-center text-gray-500">
          <span class="material-icons-outlined pr-2 !text-[200px] text-gray-200">map</span>

          <p class="mb-4">Nothing to see here yet.</p>

          <NuxtLink to="/addtrip">
              <button type="button" class="inline-flex justify-center mr-2 py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="material-icons pr-2 !text-xl text-white">add</span>
              <span class="mt-1">New Trip</span>
            </button>
          </NuxtLink>
        </div>

        <ul>
          <li v-for="trip in trips">
            <NuxtLink v-bind:to="/trips/ + trip.id">
              <TripCard
              v-bind:id="trip.id"
              v-bind:name="trip.name"
              v-bind:startTimestamp="trip.start ? trip.start.timestamp : ''"
              v-bind:startTimezoneName="trip.start ? trip.start.timezoneName : ''"
              v-bind:endTimestamp="trip.end ? trip.end.timestamp : ''"
              v-bind:endTimezoneName="trip.end ? trip.end.timezoneName : ''" />
            </NuxtLink>
          </li>
        </ul>
      </main>
    </div>
  </Transition>
</template>

<style scoped></style>
