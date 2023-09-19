<template>
  <div class="navbar">
    <div class="logo">
      <div class="logo-title">
        <div class="logo" v-if="!boardStore.isSideBarVisible">
          <div class="logo-img" :class="{ dark: themeStore.isDarkMode }"></div>
        </div>
        <h1>{{ boardStore.selectedBoard?.name }}</h1>
      </div>
    </div>
    <div class="navbar-btns">
      <button @click="isNewTaskVisible = true" class="add-new-task-btn">+ Add New Task</button>
      <button @click="isCrudDropdownVisble = !isCrudDropdownVisble" ref="dropdownToggleBtn">
        <img src="../assets/images/icon-vertical-ellipsis.svg" alt="ellipsis" />
      </button>

      <Transition>
        <div v-if="isCrudDropdownVisble" class="crud-dropdown">
          <p @click="boardStore.isEditBoardVisible = true">Edit Board</p>
          <p @click="isDeleteBoardConfirmationVisible = true" class="delete-text">Delete Board</p>
        </div>
      </Transition>
    </div>
  </div>

  <GenericDialog
    @close="isDeleteBoardConfirmationVisible = false"
    :is-dialog-visible="isDeleteBoardConfirmationVisible"
    header-class="delete-board-header"
    header="Delete this board?"
  >
    Are you sure you want to delete the <b> ‘{{ boardStore.selectedBoard?.name }}’ </b> board? This
    action will remove all columns and tasks and cannot be reversed.

    <div class="remove-board-footer">
      <button @click="deleteBoard" class="delete-board-btn">Delete</button>
      <button @click="isDeleteBoardConfirmationVisible = false" class="cancel-delete-board-btn">
        Cancel
      </button>
    </div>
  </GenericDialog>

  <GenericDialog
    @close="boardStore.isEditBoardVisible = false"
    :is-dialog-visible="boardStore.isEditBoardVisible"
    header="Edit Board"
  >
    <Form @submit="onSubmit" :validation-schema="schema" class="form-body">
      <GenericInput
        placeholder="e.g. Web Design"
        :autofocus="true"
        label="Board Name"
        name="name"
        :value="boardStore.selectedBoard?.name"
      />
      <div class="columns">
        <label>Board Columns</label>
        <TransitionGroup name="list">
          <div
            v-for="(column, index) of boardStore.selectedBoard?.columns"
            :key="index"
            class="column-input"
          >
            <input v-model="column.name" />
            <img
              src="../assets/images/icon-cross.svg"
              @click="boardStore.selectedBoard?.columns.splice(index, 1)"
            />
          </div>
        </TransitionGroup>
        <button type="button" @click="addColumn()" class="add-column-btn">+ Add New Column</button>
      </div>
      <button class="submit-btn" type="submit">Save Changes</button>
    </Form>
  </GenericDialog>

  <GenericDialog
    @close="isNewTaskVisible = false"
    :is-dialog-visible="isNewTaskVisible"
    header="Add New Task"
  >
    <Form @submit="onNewTaskSubmit" :validation-schema="taskSchema" class="form-body">
      <GenericInput
        placeholder="e.g. Take coffee break"
        :autofocus="true"
        label="Title"
        name="title"
      />

      <GenericInput
        placeholder="e.g. It’s always good to take a break. This 15 minute break will 
      recharge the batteries a little."
        label="Description"
        name="description"
        :is-text-area="true"
      />

      <div class="columns">
        <label>Subtasks</label>
        <TransitionGroup name="list">
          <div v-for="(subtask, index) of task.subtasks" :key="index" class="column-input">
            <input v-model="subtask.title" :placeholder="subtask.placeholder" />
            <img src="@/assets/images/icon-cross.svg" @click="task.subtasks.splice(index, 1)" />
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
      />
      <button class="submit-btn" type="submit">Create Task</button>
    </Form>
  </GenericDialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue'
import GenericDialog from '@/components/generic-dialog.vue'
import { useBoardStore } from '@/stores/boardStore'
import * as Yup from 'yup'
import { Form } from 'vee-validate'
import GenericInput from './generic-input.vue'
import type { Task } from '@/interfaces/task'
import Dropdown from 'primevue/dropdown'
import { useThemeStore } from '@/stores/themeStore'

const isCrudDropdownVisble = ref(false)
const isDeleteBoardConfirmationVisible = ref(false)
const isNewTaskVisible = ref(false)
const dropdownToggleBtn = ref()
const boardStore = useBoardStore()
const selectedStatus = ref()
const themeStore = useThemeStore()

const task = ref<Task>({
  subtasks: [
    { isCompleted: false, title: '', placeholder: 'e.g. Make coffee' },
    { isCompleted: false, title: '', placeholder: 'e.g. Drink coffee & smile' }
  ],
  description: '',
  status: '',
  title: ''
})

const handleClickOutside = (event: any) => {
  if (
    dropdownToggleBtn.value &&
    !dropdownToggleBtn.value.contains(event.target) &&
    isCrudDropdownVisble.value
  ) {
    isCrudDropdownVisble.value = false
  }
}

const schema = Yup.object().shape({
  name: Yup.string().required(`Can't be empty`)
})

const taskSchema = Yup.object().shape({
  title: Yup.string().required(`Can't be empty`),
  description: Yup.string()
})

const addColumn = () => {
  boardStore.selectedBoard?.columns.push({ name: '', tasks: [] })
}

const addSubTask = () => {
  task.value.subtasks.push({ title: '', isCompleted: false })
}

const onSubmit = (values: any) => {
  if (boardStore.selectedBoard) {
    boardStore.selectedBoard.name = values.name
  }
  boardStore.isEditBoardVisible = false
}

const onNewTaskSubmit = (values: any) => {
  const column = boardStore.selectedBoard?.columns.find(
    (c) => c.name?.toLowerCase() === selectedStatus.value.name.toLowerCase()
  )

  const createdTask: Task = {
    subtasks: task.value.subtasks,
    description: values.description,
    title: values.title
  }

  column?.tasks?.push(createdTask)
  isNewTaskVisible.value = false
  task.value = {
    subtasks: [
      { isCompleted: false, title: '', placeholder: 'e.g. Make coffee' },
      { isCompleted: false, title: '', placeholder: 'e.g. Drink coffee & smile' }
    ]
  }
}

const deleteBoard = () => {
  if (boardStore.selectedBoard) {
    const index = boardStore.boards.indexOf(boardStore.selectedBoard)
    boardStore.boards.splice(index, 1)
    isDeleteBoardConfirmationVisible.value = false
    boardStore.selectedBoard = boardStore.boards[0]
  }
}

watchEffect(() => {
  selectedStatus.value = boardStore.selectedBoard?.columns[0]
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  background-color: var(--darkGreyBackground);

  .logo {
    display: flex;
    align-items: center;
    gap: 3.875rem;

    .logo-title {
      display: flex;
      align-items: center;
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--textColor);
      }
    }

    .logo-img {
      background-image: url('../assets/images/logo-dark.svg');
      background-repeat: no-repeat;
      width: 160.528px;
      height: 25.224px;
      margin-right: 1rem;
      border-right: 1px solid lightgray;

      &.dark {
        background-image: url('../assets/images/logo-light.svg');
      }
    }
  }

  .navbar-btns {
    gap: 1.5rem;
    display: flex;
    position: relative;

    .add-new-task-btn {
      background-color: var(--mainPurple);
      padding: 1rem 1.5rem;
      font-size: 0.9375rem;
      font-weight: 700;
    }

    .crud-dropdown {
      position: absolute;
      top: 130%;
      right: 0;
      background-color: var(--bodyBackground);
      border-radius: 8px;
      box-shadow: 0px 10px 20px 0px rgba(54, 78, 126, 0.25);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 1rem;
      color: var(--mediumGrey);
      font-weight: 500;

      p {
        cursor: pointer;
      }

      .delete-text {
        color: var(--red);
      }
    }
  }
}
</style>
