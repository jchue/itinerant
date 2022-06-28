<script lang="ts" setup>
const { $supabase } = useNuxtApp();

const email = ref(null);

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref (null);

async function reset() {
  try {
    errorMessage.value = null;
    loading.value = true;

    await $supabase.auth.api.resetPasswordForEmail(email.value);

    successMessage.value = 'If the email is associated with an account, you will receive a link shortly.';
  } catch (error) {
    // Return success regardless
    successMessage.value = 'If the email is associated with an account, you will receive a link shortly.';
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
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="reset">
        <Input type="email" label="Email" add-class="mb-6" v-model="email" required />

        <Button type="submit">Reset</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
