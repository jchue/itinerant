<script lang="ts">
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

export default {
  props: ['type', 'name', 'address', 'timestamp', 'timezoneName'],
  computed: {
    prefix() {
      return (this.type === 'checkin') ? 'Check-In' : (this.type === 'checkout') ? 'Check-Out' : '';
    },
    time() {
      return format(utcToZonedTime(this.timestamp, this.timezoneName), 'p');
    },
  },
};
</script>

<template>
  <div class="flex items-center my-4 p-4 rounded shadow hover:shadow-md transition-shadow">
    <div class="flex-none text-center w-20">
      <span class="material-icons !text-4xl text-slate-300">bed</span>
    </div>
    <div class="flex-1">
      <div class="text-slate-500 text-sm">
        {{ prefix }} | {{ name }}
      </div>
      <div class="text-2xl">
        {{ time }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
