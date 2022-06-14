<script lang="ts" setup>
const route = useRoute();

let name = null;

const { data: trip, pending, refresh, error } = await useFetch(`/api/trips/${route.params.id}`);

if (!error.value) {
  ({ name } = trip.value);

  useHead({
    title: `Edit ${trip.value.name}`,
  });
}
</script>

<template>
  <div>
    <div v-if="pending">
      <Loader />
    </div>
    <div v-else-if="error">
      <NotFound />
    </div>
    <div v-else>
      <NuxtLink v-bind:to="'/trips/' + route.params.id" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

      <PageTitle>Edit Trip</PageTitle>

      <TripForm v-bind:tripId="route.params.id" v-bind:initialName="name" />
    </div>
  </div>
</template>

<style scoped></style>
