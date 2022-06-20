<script lang="ts" setup>
const route = useRoute();

const tripUuid = route.params.uuid;

useHead({
  title: 'New Flight',
});
</script>

<template>
  <div>
    <NuxtLink v-bind:to="'/trips/' + route.params.uuid" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>New Flight</PageTitle>

    <FlightForm v-bind:tripUuid="tripUuid" />
  </div>
</template>

<style scoped></style>
