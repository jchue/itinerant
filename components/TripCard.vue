<script lang="ts">
export default {
  props: ['name', 'start', 'end'],
};
</script>

<template>
  <div
    class="block cursor-pointer font-sans my-4 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
  >
    <span class="block font-bold uppercase">{{ name }}</span>
    <span class="block text-gray-600 text-sm">{{ $tripRange(start, end) }}</span>
  </div>
</template>

<style scoped></style>
