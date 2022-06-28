<script lang="ts" setup>
import 'material-icons/iconfont/material-icons.css';

const { $supabase } = useNuxtApp();

const user = ref($supabase.auth.user());

// Detect log in/out
$supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_IN') {
    user.value = $supabase.auth.user();
  }

  if (event === 'SIGNED_OUT') {
    user.value = null;

    return navigateTo('/login');
  }
});

async function logout() {
  await $supabase.auth.signOut();

  return navigateTo('/login');
}
</script>

<template>
  <div v-if="user">
    <NuxtLink
      to="/profile"
      class="align-middle mr-2 text-gray-500 hover:text-gray-600 text-sm" title="Edit Profile"
    >
      {{ user.email}}
    </NuxtLink>

    <span
      v-on:click="logout"
      class="align-middle cursor-pointer material-icons pr-2
      !text-xl text-gray-400 hover:text-gray-500"
      title="Log Out">
      logout
    </span>
  </div>
  <div v-else class="text-gray-500 text-sm">
    <NuxtLink to="/register" class="hover:text-gray-600">Register</NuxtLink> |
    <NuxtLink to="/login" class="hover:text-gray-600">Log In</NuxtLink>
  </div>
</template>

<style scoped></style>
