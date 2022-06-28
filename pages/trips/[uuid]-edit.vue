<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

let name = null;

const {
  data: trip,
  pending,
  refresh,
  error,
} = await useFetch(`/api/trips/${route.params.uuid}`, {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

if (!error.value) {
  ({ name } = trip.value);

  useHead({
    title: `Edit ${trip.value.name}`,
  });
}

// Require auth
definePageMeta({
  middleware: ['auth'],
});
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
      <NuxtLink v-bind:to="'/trips/' + route.params.uuid" class="text-slate-300 text-sm uppercase">
        &larr; Back
      </NuxtLink>

      <PageTitle>Edit Trip</PageTitle>

      <TripForm v-bind:tripUuid="route.params.uuid" v-bind:initialName="name" />
    </div>
  </Transition>
</template>

<style scoped></style>
