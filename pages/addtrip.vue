<script lang="ts" setup>
// Require auth
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div>
    <NuxtLink to="/trips" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>New Trip</PageTitle>

    <TripForm />
  </div>
</template>

<style scoped></style>
