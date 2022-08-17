<script lang="ts" setup>
// Require auth
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div>
    <header class="mb-6">
      <NuxtLink to="trips" class="text-gray-300 text-sm uppercase hover:text-gray-400">
        &larr; Back
      </NuxtLink>

      <PageTitle>New Trip</PageTitle>
    </header>

    <TripForm />
  </div>
</template>

<style scoped></style>
