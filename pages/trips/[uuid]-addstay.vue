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
    <NuxtLink v-bind:to="'/trips/' + route.params.uuid" class="text-slate-300 text-sm uppercase">&larr; Back</NuxtLink>

    <PageTitle>New Stay</PageTitle>

    <StayForm v-bind:tripUuid="tripUuid" />
  </div>
</template>

<style scoped></style>
