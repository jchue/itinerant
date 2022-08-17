<script lang="ts">
export default {
  props: ['label', 'type', 'size', 'disabled', 'required', 'addClass', 'modelValue'],
  emits: ['update:modelValue'],
};
</script>

<template>
  <div>
    <label class="block font-bold mb-1 text-xs uppercase">{{ label }}</label>
    <input
      v-bind:type="type || 'text'"
      v-bind:size="size || 20"
      v-bind:value="modelValue"
      v-on:input="$emit('update:modelValue', $event.target.value)"
      v-bind:class="`bg-gray-200 border-2 border-gray-200 outline-none p-2 rounded-md
      text-gray-700 text-sm disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400
      focus:border-emerald-400 ${addClass}`"
      v-bind:disabled="disabled"
      v-bind:required="required" />
  </div>
</template>

<style scoped></style>
