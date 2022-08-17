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
      }

      if (this.itemType === 'user') {
        return 'Are you sure you want to delete your account? All your trips will be deleted, and this cannot be undone.';
      }

      return null;
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
    <!-- button -->
    <SecondaryButton
      v-if="type === 'button'"
      v-bind:class="`inline-flex justify-center mb-6 ${addClass}`"
      v-on:click="showConfirm = true"
    >
      <slot />
    </SecondaryButton>

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
        class="fixed flex justify-center items-center top-0 right-0 bottom-0 left-0"
      >
        <!-- dialogue box -->
        <div class="bg-white max-w-lg px-8 py-6 overflow-hidden relative rounded-xl shadow-lg z-20">
          <header class="mb-4">
            <span class="align-middle inline-block material-icons pr-2 text-red-500 !text-2xl">error</span>
            <span class="align-middle font-bold inline-block text-md text-red-500 text-sm uppercase">Delete</span>
          </header>
          <div class="mb-6">
            <p class="text-sm">{{ confirmMessage }}</p>
          </div>
          <footer class="text-right">
            <PrimaryButton
              v-on:click="deleteItem"
              add-class="!bg-transparent !border-red-500
              mr-3 !shadow-none !text-red-500 hover:!bg-red-500 hover:!text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Yes
            </PrimaryButton>
            <PrimaryButton
              v-on:click="showConfirm = false"
            >
              No
            </PrimaryButton>
          </footer>
        </div>

        <!-- scrim -->
        <div
          v-if="showConfirm"
          v-on:click="showConfirm = false"
          class="absolute bg-white opacity-80 top-0 right-0 bottom-0 left-0 z-10"
        >
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
