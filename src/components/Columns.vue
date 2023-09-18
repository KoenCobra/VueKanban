<template>
  <div class="columns-section">
    <div class="column" v-for="(column, index) in boardStore.selectedBoard?.columns" :key="index">
      <div class="column-name">
        <div
          :style="`background-color: ${'#' + ((Math.random() * 0xffffff) << 0).toString(16)};`"
          class="column-color"
        ></div>
        <p>{{ column.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'

const boardStore = useBoardStore()
</script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';

.columns-section {
  padding: 1.55rem;
  display: flex;
  gap: 1.5rem;
  height: 100%;

  .column {
    .column-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      .column-color {
        background-color: greenyellow;
        border-radius: 50%;
        padding: 0.45rem;
      }
      p {
        color: var(--mediumGrey);
      }
    }
  }
}
</style>
