<template>
  <div v-for="(column, index) in boardStore.selectedBoard?.columns" :key="index">
    <p>{{ column.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'

const boardStore = useBoardStore()
</script>

<style scoped></style>
