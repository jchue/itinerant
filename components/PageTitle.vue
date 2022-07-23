<script lang="ts">
export default {
  props: ['addClass'],
};
</script>

<template>
  <h1 v-bind:class="'text-[2.5rem] uppercase ' + addClass">
    <slot />
  </h1>
</template>

<style scoped></style>
