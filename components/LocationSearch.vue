<script lang="ts">
export default {
  props: ['initialValue', 'addClass', 'modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      loading: false,
      focused: false,
      query: this.initialValue || null,
      suggestions: null,
      idle: null,
    };
  },
  methods: {
    async suggest() {
      this.suggestions = (await useFetch(`https://photon.komoot.io/api/?q=${this.query}`)).data.value.features;
    },
    triggerSearch() {
      // Clear any previous selection
      this.$emit('update:modelValue', null);
      this.loading = true;

      // Require 1 second idle before retrieving suggestions
      this.idle = 1;

      const timeout = setInterval(() => {
        this.idle -= 1;

        if (this.idle <= 0) {
          clearInterval(timeout);

          if (this.query) {
            this.suggest();
            this.loading = false;
          } else {
            this.loading = false;
          }
        }
      }, 1000);
    },
    // Need delay in order for selection to register
    loseFocus() {
      setTimeout(() => {
        this.focused = false;
      }, 200);
    },
    // Upon selection, update field value and emit selection
    select(selected) {
      this.query = selected.properties.name;
      this.$emit('update:modelValue', selected);
    },
    capitalize(word) {
      return word[0].toUpperCase() + word.substring(1);
    },
  },
};
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      v-on:input="triggerSearch"
      v-on:focus="focused = true"
      v-on:blur="loseFocus"
      type="text"
      v-bind:class="`bg-gray-200 border-2 outline-none p-2 rounded-md
      text-gray-700 text-sm focus:border-emerald-400 ${addClass}`"
    />
    <ul
      v-show="focused"
      class="absolute z-10 mt-1 bg-white shadow-lg max-h-56 rounded-md py-1 text-base
      ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
    >
      <li
        v-if="loading"
        class="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm">
        Loading...
      </li>
      <li
        v-for="suggestion in suggestions"
        v-bind:key="suggestion.properties.osm_id"
        v-on:click="select(suggestion)"
        class="text-gray-900 cursor-pointer select-none relative
        py-2 pl-3 pr-9 text-sm hover:bg-gray-100"
      >
        <span class="block">{{ suggestion.properties.name }}</span>
        <span class="block text-gray-400 text-xs">
          ({{ capitalize(suggestion.properties.osm_value) }}) {{ suggestion.properties.city ? suggestion.properties.city + ',' : '' }} {{ suggestion.properties.state ? suggestion.properties.state + ',' : '' }} {{ suggestion.properties.country }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
