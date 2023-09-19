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
    <div class="task-details">
      <div class="task-title-section">
        <div class="task-title">
          <h3>{{ selectedTask.title }}</h3>
          <img
            ref="dropdownToggleBtn"
            @click="isCrudDropdownVisble = !isCrudDropdownVisble"
            src="../assets/images/icon-vertical-ellipsis.svg"
            alt="ellipsis"
          />
          <div v-if="isCrudDropdownVisble" class="crud-dropdown">
            <p @click="isEditTaskVisible = true">Edit Task</p>
            <p @click="isDeleteTaskConfirmationVisible = true" class="delete-text">Delete Task</p>
          </div>
        </div>
        <p>{{ selectedTask.description }}</p>
      </div>
      <div class="subtasks">
        <label class="subtasks-label"
          >SubTasks ({{ selectedTask.subtasks.filter((s: any) => s.isCompleted).length }} of
          {{ selectedTask.subtasks.length }})</label
        >
        <div
          class="subtask"
          :class="{ completed: subtask.isCompleted }"
          v-for="(subtask, index) in selectedTask.subtasks"
          :key="index"
        >
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
      <button @click="isTaskVisible = false" class="submit-btn" type="submit">Save Changes</button>
    </div>
  </GenericDialog>
</template>

<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import GenericDialog from '@/components/generic-dialog.vue'
import Dropdown from 'primevue/dropdown'
import type { Task } from '@/interfaces/task'
import Checkbox from 'primevue/checkbox'

const boardStore = useBoardStore()
const isTaskVisible = ref(false)
const selectedStatus = ref()
const selectedTask = ref()
const isCrudDropdownVisble = ref(false)
const isEditTaskVisible = ref(false)
const isDeleteTaskConfirmationVisible = ref(false)
const dropdownToggleBtn = ref()

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

const handleClickOutside = (event: any) => {
  if (
    dropdownToggleBtn.value &&
    !dropdownToggleBtn.value.contains(event.target) &&
    isCrudDropdownVisble.value
  ) {
    isCrudDropdownVisble.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
.task-details {
  display: grid;
  gap: 1.5rem;
  .task-title-section {
    .task-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      margin-bottom: 1.5rem;
      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--textColor);
      }

      img {
        padding-inline: 0.5rem;
        cursor: pointer;
      }
    }

    p {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--mediumGrey);
    }
  }

  .subtasks {
    .subtasks-label {
      color: var(--mediumGrey);
      font-size: 0.75rem;
      font-weight: 700;
    }

    .subtask {
      margin-top: 1rem;
      display: flex;
      gap: 1.25rem;
      background-color: var(--subtaskBackground);
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;

      &.completed label {
        text-decoration: line-through;
      }
    }
  }
}

.crud-dropdown {
  position: absolute;
  top: 4rem;
  right: 3rem;
  background-color: var(--bodyBackground);
  border-radius: 8px;
  box-shadow: 0px 10px 20px 0px rgba(54, 78, 126, 0.25);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.8125rem;
  color: var(--mediumGrey);
  font-weight: 500;

  p {
    cursor: pointer;
  }

  .delete-text {
    color: var(--red) !important;
  }
}
</style>
