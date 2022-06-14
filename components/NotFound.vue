<script lang="ts" setup>
const router = useRouter();

useHead({
  title: 'Not Found',
});
</script>

<template>
  <div class="pt-10 text-center">
    <span class="block text-indigo-600">404</span>
    <span class="block font-bold text-4xl">Page not found</span>
    <p class="font-light mb-6 text-gray-500">Sorry, we couldn't find the page you're looking for.</p>
    <NuxtLink v-on:click="router.go(-1)" class="cursor-pointer text-indigo-600 hover:text-indigo-700">&larr; Go back</NuxtLink>
  </div>
</template>

<style scoped></style>
