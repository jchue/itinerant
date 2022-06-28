<script lang="ts">
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      trips: null,
    };
  },
  async mounted() {
    const { $supabase } = useNuxtApp();

    // Get current session
    const session = $supabase.auth.session();

    this.trips = (await useFetch('/api/trips', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })).data;
  },
  methods: {
    displayRange(dateRange) {
      return dateRange ? `(${dateRange})` : '';
    },
  },
};
</script>

<template>
  <div>
    <select v-bind:value="modelValue" v-on:input="$emit('update:modelValue', $event.target.value)" class="bg-white border border-gray-300 p-2 rounded-md shadow-sm text-gray-700 text-sm w-full" required>
      <option v-for="trip in trips" v-bind:value="trip.uuid">
      {{ trip.name }} {{ displayRange($tripRange(trip.start, trip.end)) }}</option>
    </select>
  </div>
</template>

<style scoped></style>
