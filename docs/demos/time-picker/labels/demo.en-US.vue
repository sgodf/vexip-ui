<template>
  <TimePicker
    v-model:value="time"
    separator=""
    :labels="{
      hour: 'H',
      minute: 'M',
      second: 'S'
    }"
    style="max-width: 300px;"
  ></TimePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const time = ref('')
</script>
