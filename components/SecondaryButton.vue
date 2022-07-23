<script lang="ts">
export default {
  props: ['type', 'addClass'],
};
</script>

<template>
  <button
    v-bind:type="type"
    v-bind:class="`bg-white font-bold inline-flex justify-center py-2 px-3 border border-emerald-700
    text-emerald-700 text-xs transition-shadow uppercase hover:shadow-glow hover:shadow-emerald-700/25 focus:outline-none ${addClass}`"
  >
    <slot />
  </button>
</template>

<style scoped></style>
