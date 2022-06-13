<script lang="ts" setup>
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

const route = useRoute();

const { data: trip } = await useFetch(`/api/trips/${route.params.id}`);

/* Refresh data in case just edited */
refreshNuxtData();
</script>

<template>
  <div>
    <NuxtLink to="/trips" class="block text-slate-300 text-sm uppercase">&larr; Trips</NuxtLink>

    <NuxtLink v-bind:to="'/trips/' + route.params.id + '-addflight'">
      <span class="float-right material-icons pr-2 !text-xl text-gray-500">flight</span>
    </NuxtLink>
    <NuxtLink v-bind:to="'/trips/' + route.params.id + '-addstay'">
      <span class="float-right material-icons pr-2 !text-xl text-gray-500">bed</span>
    </NuxtLink>

    <PageTitle add-class="inline-block mr-2">{{ trip.name }}</PageTitle>
    <DeleteButton itemType="trip" v-bind:itemId="route.params.id" />
    <NuxtLink v-bind:to="'/trips/' + route.params.id + '-edit'">
      <span class="material-icons !text-xl text-gray-500">edit</span>
    </NuxtLink>

    <ul>
      <li v-for="(group, date) in trip.events">
        <h2 class="font-bold text-2xl">{{ format(utcToZonedTime(date, group[0].indexTimezoneName), 'EEEE, LLLL d, yyyy') }}</h2>

        <ul>
          <li v-for="event in group">
            <NuxtLink v-if="event.type === 'flight'" v-bind:to="/flights/ + event.id">
              <FlightCard v-bind:airline="event.airline" v-bind:flightNumber="event.flightNumber" v-bind:departureAirport="event.departureAirport.code" v-bind:departureTimestamp="event.departureTimestamp" v-bind:departureTimezoneName="event.departureTimezoneName" v-bind:arrivalAirport="event.arrivalAirport.code" v-bind:arrivalTimestamp="event.arrivalTimestamp" v-bind:arrivalTimezoneName="event.arrivalTimezoneName" />
            </NuxtLink>
            <NuxtLink v-if="event.type === 'checkin' || event.type === 'checkout'" v-bind:to="/stays/ + event.id">
              <StayCard v-bind:type="event.type" v-bind:name="event.name" v-bind:address="event.address" v-bind:timestamp="event.indexTimestamp" v-bind:timezoneName="event.indexTimezoneName" />
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
