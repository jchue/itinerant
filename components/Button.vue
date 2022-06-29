<script lang="ts">
export default {
  props: ['type', 'addClass'],
};
</script>

<template>
  <button
    v-bind:type="type"
    v-bind:class="`inline-flex justify-center py-2 px-4 border border-transparent
    shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${addClass}`"
  >
    <slot />
  </button>
</template>

<style scoped></style>
