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

    return navigateTo(route.query.redirect.toString());
  } catch (error) {
    errorMessage.value = error.message;

    return null;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <PageTitle>Log In</PageTitle>

      <Alert v-if="errorMessage" type="error" add-class="mb-6">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="login">
        <Input type="email" label="Email" add-class="mb-4" v-model="email" required />
        <Input type="password" label="Password" add-class="mb-6" v-model="password" required />

        <NuxtLink to="/reset" class="mr-4 text-gray-500 text-xs hover:text-gray-600">
          Forgot password?
        </NuxtLink>
        <Button type="submit">Log In</Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
