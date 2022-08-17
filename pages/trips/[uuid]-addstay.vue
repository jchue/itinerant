<script lang="ts" setup>
const route = useRoute();

const tripUuid = route.params.uuid;

useHead({
  title: 'New Stay',
});

// Require auth
definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <div>
    <header class="mb-6">
      <NuxtLink
        v-bind:to="'/trips/' + route.params.uuid"
        class="text-gray-300 text-sm uppercase hover:text-gray-400"
      >
        &larr; Back
      </NuxtLink>

      <PageTitle>New Stay</PageTitle>
    </header>

    <StayForm v-bind:tripUuid="tripUuid" />
  </div>
</template>

<style scoped></style>
