<script lang="ts" setup>
const { $supabase } = useNuxtApp();

// Get current session
const session = $supabase.auth.session();

/**
 * Get any initialized props
 * */

const props = defineProps(['tripUuid', 'initialName']);

const name = ref(props.initialName || null);

/**
 * Handle form
 */

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

async function updateTrip() {
  errorMessage.value = null;
  loading.value = true;

  // Check required fields
  if (!name.value) {
    loading.value = false;
    errorMessage.value = 'Name is required.';

    return;
  }

  const body = {
    name: name.value,
  };

  const headers = { Authorization: `Bearer ${session.access_token}` };

  let response = null;
  let nextPath = null;

  try {
    // If id exists, update; otherwise, create new
    if (props.tripUuid) {
      response = await $fetch(`/api/trips/${props.tripUuid}`, { method: 'put', body, headers });
      nextPath = `/trips/${props.tripUuid}`;
      successMessage.value = 'The trip has been updated!';
    } else {
      response = await $fetch('/api/trips', { method: 'post', body, headers });
      nextPath = `/trips/${response.uuid}`;
      successMessage.value = 'The trip has been created!';
    }

    await navigateTo({
      path: nextPath,
    });
  } catch (error) {
    errorMessage.value = 'Uh oh, something went wrong. Please try again later.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-sm">
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="updateTrip">
        <div class="mb-8">
          <Input label="Name" type="text" add-class="w-full" v-model="name" required />
        </div>

        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
