<script lang="ts" setup>
import 'material-icons/iconfont/material-icons.css';

const { $supabase } = useNuxtApp();

// Get current session
const session = $supabase.auth.session();

const {
  data: trips,
  pending,
  refresh,
  error,
} = await useFetch('/api/trips', {
  headers: { Authorization: `Bearer ${session.access_token}` },
});

useHead({
  title: 'Trips',
});

// Require auth
definePageMeta({
  middleware: ['auth'],
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
        <PageTitle add-class="align-middle inline-block mr-6">Trips</PageTitle>

        <NuxtLink to="/addtrip">
          <SecondaryButton add-class="align-middle flex inline-block items-center pr-5">
            <span class="!leading-none material-icons !text-lg">add</span>
            New
          </SecondaryButton>
        </NuxtLink>
      </header>

      <main>
        <!-- Blank state -->
        <div v-if="trips.length === 0" class="p-6 rounded-lg text-center text-gray-500">
          <span class="material-icons-outlined pr-2 !text-[200px] text-gray-200">map</span>

          <p class="mb-4">Nothing to see here yet.</p>

          <NuxtLink to="/addtrip">
            <Button type="button">
              <span class="material-icons pr-2 !text-xl text-white">add</span>
              <span class="mt-1">New Trip</span>
            </Button>
          </NuxtLink>
        </div>

        <ul class="grid grid-cols-4 gap-4">
          <li v-for="trip in trips" v-bind:key="trip.uuid">
            <NuxtLink v-bind:to="/trips/ + trip.uuid">
              <TripCard
                v-bind:name="trip.name"
                v-bind:start="trip.start"
                v-bind:end="trip.end"
              />
            </NuxtLink>
          </li>
        </ul>
      </main>
    </div>
  </Transition>
</template>

<style scoped></style>
