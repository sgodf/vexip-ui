<template>
  <DatePicker
    v-model:value="date"
    filler="?"
    clearable
    style="max-width: 300px;"
  ></DatePicker>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const date = ref(null)
</script>
