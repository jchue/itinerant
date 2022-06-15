<script lang="ts" setup>
/* Get any initialized props */

const props = defineProps(['tripId', 'initialName']);

const name = ref(props.initialName || null);

/* Handle form */

let loading = ref(false);
let success = ref(false);
let error = ref(false);

async function updateTrip() {
  loading.value = true;

  /* Check required fields */
  if (!name.value) {
    loading.value = false;
    error.value = 'Name is required.';

    return;
  }

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

    success.value = 'The trip has been updated!';
  } catch (error) {
    error.value = 'Uh oh, something went wrong. Please try again later.';
  }

  loading.value = false;

  await navigateTo({
    path: nextPath,
  });
}
</script>

<template>
  <div>
    <form v-on:submit.prevent="updateTrip">
      <div class="mb-6">
        <Input label="Name" type="text" add-class="w-full" v-model="name" required />
      </div>

      <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>

      <Loader v-if="loading" />

      <Alert v-else-if="success" type="success">
        {{ success }}
      </Alert>

      <Alert v-else-if="error" type="error">
        {{ error }}
      </Alert>
    </form>
  </div>
</template>

<style scoped></style>
