<script lang="ts">
export default {
  props: ['label', 'type', 'size', 'disabled', 'required', 'addClass', 'modelValue'],
  emits: ['update:modelValue'],
};
</script>

<template>
  <div>
    <label class="block font-medium mb-1 text-sm">{{ label }}</label>
    <input
      v-bind:type="type || 'text'"
      v-bind:size="size || 20"
      v-bind:value="modelValue"
      v-on:input="$emit('update:modelValue', $event.target.value)"
      v-bind:class="'bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm disabled:opacity-75 ' + addClass"
      v-bind:disabled="disabled"
      v-bind:required="required" />
  </div>
</template>

<style scoped></style>
