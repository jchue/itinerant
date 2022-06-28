<script lang="ts">
export default {
  props: ['name', 'start', 'end'],
};
</script>

<template>
  <div
    class="block cursor-pointer font-sans my-4 p-4 rounded shadow hover:shadow-md transition-shadow"
  >
    <span class="block font-bold">{{ name }}</span>
    <span class="block text-slate-500 text-sm">{{ $tripRange(start, end) }}</span>
  </div>
</template>

<style scoped></style>
