<template>
  <NumberInput v-model:value="value" style="max-width: 300px;"></NumberInput>
  <p>Number Input Value: {{ value }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref<number>()
</script>
