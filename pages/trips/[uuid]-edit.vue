<script lang="ts" setup>
const route = useRoute();

let name = null;

const { data: trip, pending, refresh, error } = await useFetch(`/api/trips/${route.params.uuid}`);

if (!error.value) {
  ({ name } = trip.value);

  useHead({
    title: `Edit ${trip.value.name}`,
  });
}
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
      <NuxtLink v-bind:to="'/trips/' + route.params.uuid" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

      <PageTitle>Edit Trip</PageTitle>

      <TripForm v-bind:tripUuid="route.params.uuid" v-bind:initialName="name" />
    </div>
  </Transition>
</template>

<style scoped></style>
