<script lang="ts" setup>
const { $supabase } = useNuxtApp();

const email = ref(null);
const password = ref(null);

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

async function register() {
  try {
    errorMessage.value = null;
    loading.value = true;

    // Check required fields
    if (!email.value || !password.value) {
      throw new Error('Email and Password are required.');
    }

    // Simple email format check
    const regex = /.+@.+\..+/g;
    if (!regex.test(email.value)) {
      throw new Error('Invalid Email');
    }

    // Enforce password length
    if (password.value.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    successMessage.value = 'Please check your email for a verification link.';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

useHead({
  title: 'Register',
});
</script>

<template>
  <div class="mt-10 mx-auto max-w-sm">
    <PageTitle add-class="mb-6 text-center">Register</PageTitle>

    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error" add-class="mb-6">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="register" class="p-10 rounded-lg shadow-lg">
        <Input type="email" label="Email" add-class="mb-4 w-full" v-model="email" required />
        <Input
          type="password"
          label="Password"
          add-class="mb-6 w-full"
          v-model="password"
          required
        />

        <div class="text-right">
          <PrimaryButton type="submit">Register</PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
