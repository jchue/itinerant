<script lang="ts">
import 'material-icons/iconfont/material-icons.css';

export default {
  props: ['itemType', 'itemId', 'addClass'],
  data() {
    return {
      showConfirm: false,
    };
  },
  methods: {
    async deleteItem() {
      this.showConfirm = false;

      try {
        let response = null;
        let nextPath = null;

        switch (this.itemType) {
          case 'trip':
            response = await $fetch(`/api/trips/${this.itemId}`, { method: 'delete' });
            nextPath = `/trips`;
            break;
          case 'flight':
            response = await $fetch(`/api/flights/${this.itemId}`, { method: 'delete' });
            nextPath = `/trips/${response.tripId}`;
            break;
          case 'stay':
            response = await $fetch(`/api/stays/${this.itemId}`, { method: 'delete' });
            nextPath = `/trips/${response.tripId}`;
            break;
          default:
            break;
        }

        navigateTo({
          path: nextPath,
        });
      } catch (error) {

      }
    },
  },
};
</script>

<template>
  <div class="inline">
    <button v-bind:class="'material-icons pr-2 !text-xl text-gray-500 ' + addClass " v-on:click="showConfirm = true">delete</button>

    <div v-if="showConfirm" class="bg-white fixed overflow-hidden rounded-lg shadow-xl">
      <div class="mb-2 px-4 py-3">
        <div class="inline-block align-top pr-2">
          <span class="material-icons pr-2 !text-2xl text-red-500">error</span>
        </div>
        <div class="inline-block">
          <span class="block mb-3 text-md font-medium text-gray-900">Delete</span>

          <p class="text-gray-500 text-sm">Are you sure you want to delete this {{ itemType }}?</p>
        </div>
      </div>
      <div class="bg-gray-50 px-4 py-3 text-right">
        <button v-on:click="deleteItem" class="rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium mr-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Yes</button>
        <button v-on:click="showConfirm = false" class="rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">No</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
