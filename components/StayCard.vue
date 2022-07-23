<script lang="ts">
import { format } from 'date-fns';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';
import 'material-icons/iconfont/material-icons.css';

export default {
  props: ['type', 'name', 'address', 'timestamp', 'timezoneName'],
  computed: {
    prefix() {
      let prefix = '';

      if (this.type === 'checkin') {
        prefix = 'Check-In';
      } else if (this.type === 'checkout') {
        prefix = 'Check-Out';
      }

      return prefix;
    },
    time() {
      return format(utcToZonedTime(this.timestamp, this.timezoneName), 'p');
    },
  },
};
</script>

<template>
  <div class="flex items-center p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
    <div class="flex-1">
      <div class="text-gray-600 text-xs uppercase">
        {{ prefix }}
      </div>
      <div class="font-bold mr-4 text-emerald-700 text-2xl">
        {{ time }}
      </div>
      <div class="font-light -mt-1 text-gray-500 text-[0.625rem]">
        {{ timezoneName }}
      </div>
      <div class="font-light mt-6 text-emerald-700 text-xl">
        {{ name }}
      </div>
    </div>

    <div class="flex-none text-center w-20">
      <span class="material-icons !text-4xl text-slate-300">bed</span>
    </div>
  </div>
</template>

<style scoped></style>
