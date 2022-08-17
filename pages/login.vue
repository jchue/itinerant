<script lang="ts" setup>
const { $supabase } = useNuxtApp();
const route = useRoute();

const session = ref($supabase.auth.session());

// Show loading state until session is mounted
const loading = ref(true);

useHead({
  title: '',
});

onMounted(() => {
  if (session.value) {
    return navigateTo(route.query.redirect + route.hash);
  }

  loading.value = false;

  useHead({
    title: 'Log In',
  });

  return null;
});

watch(session, () => {
  if (session.value) {
    return navigateTo(route.query.redirect + route.hash);
  }

  return null;
});

/**
 * Handle form
 */

const email = ref(null);
const password = ref(null);

const successMessage = ref(null);
const errorMessage = ref(null);

async function login() {
  try {
    loading.value = true;

    const { error } = await $supabase.auth.signIn({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    successMessage.value = 'Login successful!';

    return navigateTo(route.query.redirect ? route.query.redirect.toString() : '/');
  } catch (error) {
    errorMessage.value = error.message;

    return null;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mt-10 mx-auto max-w-sm">
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <PageTitle add-class="mb-6 text-center">Log In</PageTitle>

      <Alert v-if="errorMessage" type="error" add-class="mb-6">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="login" class="p-10 rounded-lg shadow">
        <Input type="email" label="Email" add-class="mb-4 w-full" v-model="email" required />
        <Input type="password" label="Password" add-class="mb-6 w-full" v-model="password" required />

        <div class="flex items-center">
          <NuxtLink to="/reset" class="flex-1 mr-4 text-emerald-500 text-xs hover:text-emerald-400">
            Forgot password?
          </NuxtLink>
          <PrimaryButton type="submit">Log In</PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
