<template>
  <div class="empty-board" v-if="!boardStore.selectedBoard?.columns.length">
    <p>This board is empty. Create a new column to get started.</p>
    <button @click="boardStore.isEditBoardVisible = true" class="add-column-btn">
      +Add New Column
    </button>
  </div>
  <div
    class="columns-section"
    v-else
    :style="boardStore.isSideBarVisible ? 'width: calc(100vw - 18.75rem)' : 'width: 100vw'"
  >
    <div class="column" v-for="(column, index) in boardStore.selectedBoard?.columns" :key="index">
      <div class="column-name">
        <div :style="`background-color: ${column.color};`" class="column-color"></div>
        <p>{{ column.name }} ({{ column.tasks?.length }})</p>
      </div>
      <draggable
        @vnode-updated="test($event)"
        class="tasks"
        :list="column.tasks"
        group="tasks"
        itemKey="name"
        :animation="300"
      >
        <template #item="{ element }">
          <div @click="openTask(element, column)" class="task">
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
            <p @click="openEditTask">Edit Task</p>
            <p @click="openDeleteTask" class="delete-text">Delete Task</p>
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
      <div>
        <p class="current-status">Current Status</p>

        <Dropdown
          v-model="selectedStatus"
          :options="boardStore.selectedBoard?.columns"
          optionLabel="name"
          @change="changeStatus($event)"
        />
      </div>
      <button @click="isTaskVisible = false" class="submit-btn" type="submit">Save Changes</button>
    </div>
  </GenericDialog>

  <GenericDialog
    @close="isDeleteTaskConfirmationVisible = false"
    :is-dialog-visible="isDeleteTaskConfirmationVisible"
    header-class="delete-board-header"
    header="Delete this Task?"
  >
    Are you sure you want to delete the <b> ‘{{ selectedTask.title }}’ </b> task?

    <div class="remove-board-footer">
      <button @click="deleteTask" class="delete-board-btn">Delete</button>
      <button @click="isDeleteTaskConfirmationVisible = false" class="cancel-delete-board-btn">
        Cancel
      </button>
    </div>
  </GenericDialog>

  <GenericDialog
    @close="isEditTaskVisible = false"
    :is-dialog-visible="isEditTaskVisible"
    header="Add New Task"
  >
    <Form @submit="onNewTaskSubmit" :validation-schema="taskSchema" class="form-body">
      <GenericInput
        placeholder="e.g. Take coffee break"
        :autofocus="true"
        label="Title"
        name="title"
        :value="selectedTask.title"
      />

      <GenericInput
        placeholder="e.g. It’s always good to take a break. This 15 minute break will 
      recharge the batteries a little."
        label="Description"
        name="description"
        :is-text-area="true"
        :value="selectedTask.description"
      />

      <div class="columns">
        <label>Subtasks</label>
        <TransitionGroup name="list">
          <div v-for="(subtask, index) of selectedTask.subtasks" :key="index" class="column-input">
            <input v-model="subtask.title" :placeholder="subtask.placeholder" />
            <img
              src="@/assets/images/icon-cross.svg"
              @click="selectedTask.subtasks.splice(index, 1)"
            />
          </div>
        </TransitionGroup>
        <button type="button" @click="addSubTask()" class="add-column-btn">
          + Add New Subtask
        </button>
      </div>

      <Dropdown
        v-model="selectedStatus"
        :options="boardStore.selectedBoard?.columns"
        optionLabel="name"
        @change="changeStatus($event)"
      />
      <button class="submit-btn" type="submit">Save Changes</button>
    </Form>
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
import GenericInput from './generic-input.vue'
import { Form } from 'vee-validate'
import * as Yup from 'yup'

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

const test = (e: any) => {
  console.log(e.props)
}

const openTask = (task: Task, column: any) => {
  isTaskVisible.value = true
  selectedTask.value = task

  selectedStatus.value = column
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

const openDeleteTask = () => {
  isTaskVisible.value = false
  isDeleteTaskConfirmationVisible.value = true
}

const openEditTask = () => {
  isTaskVisible.value = false
  isEditTaskVisible.value = true
}

const deleteTask = () => {
  const currentColumn = boardStore.selectedBoard?.columns.find(
    (c) => c.tasks?.includes(selectedTask.value)
  )

  if (currentColumn && currentColumn.tasks) {
    const taskIndex = currentColumn.tasks.indexOf(selectedTask.value)
    if (taskIndex > -1) {
      currentColumn.tasks.splice(taskIndex, 1)
    }
  }

  isDeleteTaskConfirmationVisible.value = false
  selectedTask.value = null
}

const addSubTask = () => {
  selectedTask.value.subtasks.push({ title: '', isCompleted: false })
}

const taskSchema = Yup.object().shape({
  title: Yup.string().required(`Can't be empty`),
  description: Yup.string()
})

const onNewTaskSubmit = (values: any) => {
  selectedTask.value.title = values.title
  selectedTask.value.description = values.description
  isEditTaskVisible.value = false
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
  display: flex;
  height: calc(100vh - 94.5px);
  overflow: auto;

  @media (max-width: 800px) {
    width: 100vw !important;
  }
  .column {
    min-width: 280px;
    max-width: 280px;
    .column-name {
      padding: 1.55rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2.4px;
      position: sticky;
      top: 0;
      background-color: var(--bodyBackground);
      z-index: 1;
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
      min-height: 20rem;
      padding-left: 1.5rem;
    }
    .task {
      margin: 0 1.5rem 1.5rem 0;
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
    margin-top: 4.2rem;
    min-width: 280px;
    max-width: 280px;
    max-height: 814px;
    border-radius: 6px;
    background: var(--addColumnBackGround);
    font-size: 1.5rem;
    color: var(--mediumGrey);
    font-weight: 700;
    cursor: pointer;
  }
}

.empty-board {
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  font-size: 1.125rem;
  height: 80%;
  color: var(--mediumGrey);
  font-weight: 700;
  .add-column-btn {
    background-color: var(--mainPurple);
    font-size: 0.9375rem;
    font-weight: 700;
    padding: 0.5rem 0.7rem;
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

.current-status {
  color: var(--mediumGrey);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
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
