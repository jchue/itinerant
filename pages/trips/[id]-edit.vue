<script lang="ts" setup>
const route = useRoute();

const trip = await $fetch(`/api/trips/${route.params.id}`);

const { name } = trip;
</script>

<template>
  <div>
    <NuxtLink v-bind:to="'/trips/' + route.params.id" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>Edit Trip</PageTitle>

    <TripForm v-bind:tripId="route.params.id" v-bind:initialName="name" />
  </div>
</template>

<style scoped></style>
