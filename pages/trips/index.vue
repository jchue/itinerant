<script lang="ts" setup>
import 'material-icons/iconfont/material-icons.css';

const { data: trips } = await useFetch('/api/trips');

/* Refresh data in case just edited */
refreshNuxtData();
</script>

<template>
  <div>
    <NuxtLink to="/addtrip">
      <span class="float-right material-icons pr-2 !text-xl text-gray-500">add</span>
    </NuxtLink>

    <span class="text-slate-300 text-sm uppercase">Trips</span>

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
  </div>
</template>

<style scoped></style>
