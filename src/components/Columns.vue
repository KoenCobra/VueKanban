<template>
  <div class="columns-section">
    <div class="column" v-for="(column, index) in boardStore.selectedBoard?.columns" :key="index">
      <div class="column-name">
        <div
          :style="`background-color: ${'#' + ((Math.random() * 0xffffff) << 0).toString(16)};`"
          class="column-color"
        ></div>
        <p>{{ column.name }} ({{ column.tasks?.length }})</p>
      </div>
      <div class="tasks">
        <div class="task" v-for="(task, index) in column.tasks" :key="index">
          <p>{{ task.title }}</p>
          <p class="subtask-number">
            ({{ task.subtasks?.filter((s) => s.isCompleted).length }} of
            {{ task.subtasks?.length }} subtasks)
          </p>
        </div>
      </div>
    </div>
    <div @click="boardStore.isEditBoardVisible = true" class="add-column">+ New Column</div>
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
    width: 280px;

    .column-name {
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2.4px;
      .column-color {
        background-color: greenyellow;
        border-radius: 50%;
        padding: 0.45rem;
      }
      p {
        color: var(--mediumGrey);
      }
    }

    .tasks {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .task {
      border-radius: 8px;
      background-color: var(--darkGreyBackground);
      box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1);
      padding: 1.5rem 1rem 1rem;

      p {
        font-size: 0.9375rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: var(--textColor);
      }

      .subtask-number {
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--mediumGrey);
      }
    }
  }

  .add-column {
    display: grid;
    place-items: center;
    margin-top: 39px;
    width: 280px;
    max-height: 814px;
    border-radius: 6px;
    background: var(--addColumnBackGround);
    font-size: 1.5rem;
    color: var(--mediumGrey);
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
