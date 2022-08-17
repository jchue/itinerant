<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

// Get current session
const session = $supabase.auth.session();

let name = null;

const {
  data: trip,
  pending,
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
      <header class="mb-6">
        <NuxtLink v-bind:to="'/trips/' + route.params.uuid" class="text-gray-300 text-sm uppercase hover:text-gray-400">
          &larr; Back
        </NuxtLink>

        <PageTitle>Edit Trip</PageTitle>
      </header>

      <TripForm v-bind:tripUuid="route.params.uuid" v-bind:initialName="name" />
    </div>
  </Transition>
</template>

<style scoped></style>
