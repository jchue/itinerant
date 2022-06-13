<script lang="ts" setup>
/* Get any initialized props */

const props = defineProps(['tripId', 'initialName']);

const name = ref(props.initialName || null);

/* Handle form */

let loading = ref(false);
let success = ref(false);

async function updateTrip() {
  loading.value = true;

  const body = {
    name: name.value,
  };

  let response = null;
  let nextPath = null;

  try {
    /* If id exists, update; otherwise, create new */
    if (props.tripId) {
      response = await $fetch(`/api/trips/${props.tripId}`, { method: 'put', body });
      nextPath = `/trips/${props.tripId}`;
    } else {
      response = await $fetch(`/api/trips`, { method: 'post', body });
      nextPath = `/trips/${response.id}`;
    }

    success.value = true;
  } catch (error) {
    success.value = false;
  }

  loading.value = false;

  navigateTo({
    path: nextPath,
  });
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="updateTrip">
      <div class="mb-6">
        <Input label="Name" type="text" add-class="w-full" v-model="name" />
      </div>

      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>

      <span v-if="loading">Loading...</span>
      <div v-else-if="success" class="bg-green-50 p-4 rounded">
        <div class="inline-block align-top">
          <span class="material-icons pr-2 !text-xl text-green-300">check_circle</span>
        </div>
        <div class="inline-block">
          <span class="block text-green-900 text-sm">Success</span>
          <span class="block text-green-700 text-sm">The trip has been updated!</span>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
