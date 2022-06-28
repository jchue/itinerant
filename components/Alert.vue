<script lang="ts">
export default {
  props: ['type', 'transient', 'add-class'],
  data() {
    return {
      visible: true,
    };
  },
  computed: {
    visibility() {
      return {
        maxHeight: this.visible ? '6rem' : 0,
        opacity: this.visible ? 1 : 0,
        marginTop: this.visible ? null : 0,
        marginBottom: this.visible ? null : 0,
        paddingTop: this.visible ? null : 0,
        paddingBottom: this.visible ? null : 0,
      };
    },
  },
  mounted() {
    if (this.transient) this.disappear();
  },
  methods: {
    disappear() {
      setTimeout(() => {
        this.visible = false;
      }, 5000);
    },
  },
};
</script>

<template>
  <div
    v-if="type === 'success'"
    v-bind:class="'bg-green-50 flex px-5 py-4 rounded-md ' + addClass"
    v-bind:style="visibility"
  >
    <div class="pr-4">
      <span class="material-icons !text-xl text-green-300">check_circle</span>
    </div>
    <div class="py-1">
      <div class="text-green-900 mb-2 text-sm">
        Success
      </div>
      <div class="text-green-700 text-xs">
        <slot />
      </div>
    </div>
  </div>

  <div
    v-else-if="type === 'error'"
    v-bind:class="'bg-red-50 flex px-5 py-4 rounded-md ' + addClass"
    v-bind:style="visibility"
  >
    <div class="pr-4">
      <span class="material-icons !text-xl text-red-300">error</span>
    </div>
    <div class="py-1">
      <div class="text-red-900 mb-2 text-sm">
        Error
      </div>
      <div class="text-red-700 text-xs">
        <slot />
      </div>
    </div>
  </div>

  <div
    v-else-if="type === 'info'"
    v-bind:class="'bg-blue-50 flex px-5 py-4 rounded-md transition-all duration-1000 ' + addClass"
    v-bind:style="visibility"
  >
    <div class="pr-4">
      <span class="material-icons !text-xl text-blue-300">info</span>
    </div>
    <div class="py-1">
      <div class="text-blue-700 text-xs">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
