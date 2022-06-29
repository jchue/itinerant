<script>
export default {
  data() {
    return {
      alert: {
        message: null,
        type: null,
      },
    };
  },
  setup() {
    useHead({
      titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} - Itinerant` : 'Itinerant'),
    });
  },
  mounted() {
    /**
     * Parse possible hash values
     */

    const { $hashParam } = useNuxtApp();

    if ($hashParam()) {
      if ($hashParam().type === 'recovery') {
        return navigateTo({
          path: '/recover',
          query: {
            access_token: $hashParam().access_token,
          },
        });
      }

      if ($hashParam().type === 'signup') {
        this.alert.type = 'success';
        this.alert.message = 'Acount activated!';
      }

      if ($hashParam().type === 'email_change') {
        this.alert.type = 'success';
        this.alert.message = 'Email changed successfully!';
      }

      if ($hashParam().message) {
        this.alert.type = 'info';
        this.alert.message = $hashParam().message;
      }
    }
  },
};
</script>

<template>
  <div>
    <header class="flex items-center p-4 shadow-md sticky">
      <div class="flex-1">
        <NuxtLink to="/" class="font-bold text-lg">Itinerant</NuxtLink>
      </div>

      <User />
    </header>
    <main class="p-4">
      <Alert
        v-if="alert.message"
        v-bind:type="alert.type"
        transient="true"
        add-class="mb-6 overflow-hidden"
      >
        {{ alert.message }}
      </Alert>

      <Transition>
        <NuxtPage/>
      </Transition>
    </main>
    <footer
    ></footer>
  </div>
</template>
