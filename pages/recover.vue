<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

const password = ref(null);

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref (null);

async function updatePassword() {
  try {
    errorMessage.value = null;
    loading.value = true;

    const { error } = await $supabase.auth.api.updateUser(route.query.access_token, {
      password: password.value,
    });

    if (error) throw error;

    successMessage.value = 'Password changed successfully!';
  } catch (error) {
    errorMessage.value = 'Oops. Something went wrong.';
  } finally {
    loading.value = false;
  }
}

useHead({
  title: 'Reset Password',
});
</script>

<template>
  <div>
    <PageTitle>Reset Password</PageTitle>

    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success" add-class="mb-6">
        {{ successMessage }}
      </Alert>

      <NuxtLink to="/">
        <Button>Continue</Button>
      </NuxtLink>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="updatePassword">
        <Input type="password" label="New Password" add-class="mb-6" v-model="password" required />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
