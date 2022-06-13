<script lang="ts" setup>
const route = useRoute();

const tripId = route.params.id;
</script>

<template>
  <div>
    <NuxtLink v-bind:to="'/trips/' + route.params.id" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>New Flight</PageTitle>

    <FlightForm v-bind:tripId="tripId" />
  </div>
</template>

<style scoped></style>
