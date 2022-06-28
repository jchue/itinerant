<script lang="ts">
import 'material-icons/iconfont/material-icons.css';

export default {
  props: ['type', 'itemType', 'itemUuid', 'tripUuid', 'addClass'],
  data() {
    return {
      showConfirm: false,
    };
  },
  computed: {
    confirmMessage() {
      if (this.itemType === 'trip' || this.itemType === 'flight' || this.itemType === 'stay') {
        return `Are you sure you want to delete this ${this.itemType}?`;
      } else if (this.itemType === 'user') {
        return 'Are you sure you want to delete your account? All your trips will be deleted, and this cannot be undone.';
      }
    },
  },
  methods: {
    async deleteItem() {
      // Get current session
      const { $supabase } = useNuxtApp();
      const session = $supabase.auth.session();
      const user = $supabase.auth.user();

      this.showConfirm = false;

      const headers = { Authorization: `Bearer ${session.access_token}` };

      let nextPath = null;

      try {
        switch (this.itemType) {
          case 'trip':
            await $fetch(`/api/trips/${this.itemUuid}`, { method: 'delete', headers });
            nextPath = '/trips';
            break;
          case 'flight':
            await $fetch(`/api/flights/${this.itemUuid}`, { method: 'delete', headers });
            nextPath = `/trips/${this.tripUuid}`;
            break;
          case 'stay':
            await $fetch(`/api/stays/${this.itemUuid}`, { method: 'delete', headers });
            nextPath = `/trips/${this.tripUuid}`;
            break;
          case 'user':
            await $supabase.auth.signOut();
            await $fetch(`/api/users/${user.id}`, { method: 'delete', headers });
            nextPath = '/login';
            break;
          default:
            break;
        }

        navigateTo({
          path: nextPath,
        });
      } catch (error) {
        // TODO
      }
    },
  },
};
</script>

<template>
  <div class="inline">
    <div class="relative">
      <!-- button -->
      <button
        v-if="type === 'button'"
        v-bind:class="'inline-flex justify-center mb-6 py-2 px-4 border border-gray-300 shadow-sm text-sm rounded-md text-gray-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ' + addClass"
        v-on:click="showConfirm = true"
      >
        <slot />
      </button>

      <!-- icon -->
      <button
        v-else
        v-bind:class="'material-icons pr-2 !text-xl text-gray-500 hover:text-gray-600 ' + addClass "
        v-on:click="showConfirm = true"
      >
        delete
      </button>

      <Transition>
        <div
          v-if="showConfirm"
          class="absolute bg-white overflow-hidden rounded-lg shadow-xl top-12 z-10"
        >
          <div class="mb-2 px-4 py-3">
            <div class="inline-block align-top pr-2">
              <span class="material-icons pr-2 !text-2xl text-red-500">error</span>
            </div>
            <div class="inline-block">
              <span class="block mb-3 text-md font-medium text-gray-900">Delete</span>

              <p class="text-gray-500 text-sm">{{ confirmMessage }}</p>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 text-right">
            <button
              v-on:click="deleteItem"
              class="rounded-md border border-transparent shadow-sm px-4 py-2
              bg-red-600 text-sm font-medium mr-2 text-white hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Yes
            </button>
            <button
              v-on:click="showConfirm = false"
              class="rounded-md border border-gray-300 shadow-sm px-4 py-2
              bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              No
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- scrim -->
    <div
      v-if="showConfirm"
      v-on:click="showConfirm = !showConfirm"
      class="absolute top-0 right-0 bottom-0 left-0"
    >
    </div>
  </div>
</template>

<style scoped></style>
