<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Itinerant` : 'Itinerant';
  },
});
</script>

<template>
  <div>
    <header class="flex items-center p-4 shadow-md sticky">
      <NuxtLink to="/" class="flex-1 font-bold text-lg">Itinerant</NuxtLink>
    </header>
    <main class="p-4">
      <Transition>
        <NuxtPage/>
      </Transition>
    </main>
    <footer
    ></footer>
  </div>
</template>
