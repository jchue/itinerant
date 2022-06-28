<script lang="ts">
export default {
  props: ['addClass'],
};
</script>

<template>
  <h1 v-bind:class="'font-bold mb-4 text-3xl ' + addClass">
    <slot />
  </h1>
</template>

<style scoped></style>
