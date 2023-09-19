<template>
  <div class="columns-section">
    <div class="column" v-for="(column, index) in boardStore.selectedBoard?.columns" :key="index">
      <div class="column-name">
        <div :style="`background-color: ${column.color};`" class="column-color"></div>
        <p>{{ column.name }} ({{ column.tasks?.length }})</p>
      </div>
      <draggable class="tasks" :list="column.tasks" group="people" itemKey="title" :animation="300">
        <template #item="{ element }">
          <div @click="openTask(element)" class="task">
            <p>{{ element.title }}</p>
            <p class="subtask-number">
              ({{ element.subtasks?.filter((s: any) => s.isCompleted).length }} of
              {{ element.subtasks?.length }} subtasks)
            </p>
          </div>
        </template>
      </draggable>
    </div>
    <div @click="boardStore.isEditBoardVisible = true" class="add-column">+ New Column</div>
  </div>

  <GenericDialog
    @close="isTaskVisible = false"
    :is-dialog-visible="isTaskVisible"
    :is-close-btn-visible="false"
  >
    <div class="task-title">
      <h3>{{ selectedTask.title }}</h3>
      <p>{{ selectedTask.description }}</p>
    </div>
    <div class="subtasks">
      <label
        >SubTasks ({{ selectedTask.subtasks.filter((s: any) => s.isCompleted).length }} of
        {{ selectedTask.subtasks.length }})</label
      >
      <div class="subtask" v-for="(subtask, index) in selectedTask.subtasks" :key="index">
        <Checkbox v-model="subtask.isCompleted" :binary="true" />
        <label> {{ subtask.title }} </label>
      </div>
    </div>
    <Dropdown
      v-model="selectedStatus"
      :options="boardStore.selectedBoard?.columns"
      optionLabel="name"
      @change="changeStatus($event)"
    />
    <button class="submit-btn" type="submit">Save Changes</button>
  </GenericDialog>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { ref, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import GenericDialog from '@/components/generic-dialog.vue'
import Dropdown from 'primevue/dropdown'
import type { Task } from '@/interfaces/task'
import Checkbox from 'primevue/checkbox'

const boardStore = useBoardStore()
const isTaskVisible = ref(false)
const selectedStatus = ref()
const selectedTask = ref()

watchEffect(() => {
  boardStore.selectedBoard?.columns.forEach((column) => {
    column.color = '#' + ((Math.random() * 0xffffff) << 0).toString(16)
  })
})

const openTask = (task: Task) => {
  isTaskVisible.value = true
  selectedTask.value = task
  selectedStatus.value = boardStore.selectedBoard?.columns.find((c) => c.name === task.status)
}

const changeStatus = (event: any) => {
  const currentColumn = boardStore.selectedBoard?.columns.find(
    (c) => c.tasks?.includes(selectedTask.value)
  )

  if (currentColumn && currentColumn.tasks) {
    const taskIndex = currentColumn.tasks.indexOf(selectedTask.value)
    if (taskIndex > -1) {
      currentColumn.tasks.splice(taskIndex, 1)
    }
  }

  const newColumn = event.value
  if (newColumn.tasks) {
    newColumn.tasks.push(selectedTask.value)
  } else {
    newColumn.tasks = [selectedTask.value]
  }

  selectedTask.value.status = event.value.name
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/variables.scss';

.columns-section {
  padding: 1.55rem;
  display: flex;
  gap: 1.5rem;
  overflow: auto;
  height: calc(100vh - 94.5px);
  width: calc(100vw - 18.75rem);
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
      min-height: 20rem;
    }
    .task {
      border-radius: 8px;
      background-color: var(--darkGreyBackground);
      box-shadow: 0px 4px 6px 0px rgba(54, 78, 126, 0.1);
      padding: 1.5rem 1rem 1rem;
      cursor: pointer;

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
