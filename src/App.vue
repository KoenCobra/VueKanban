<template>
  <main :class="{ dark: themeStore.isDarkMode }">
    <Sidebar @openAddBoardDialog="openDialog" />
    <div class="main-layout">
      <Navbar />
      <Columns />
    </div>
  </main>
  <Toast position="bottom-right" />

  <GenericDialog
    :header="'Add New Board'"
    :is-dialog-visible="boardStore.isAddBoardVisible"
    @close="boardStore.isAddBoardVisible = false"
  >
    <Form @submit="onSubmit" :validation-schema="schema" class="form-body">
      <GenericInput
        placeholder="e.g. Web Design"
        :autofocus="true"
        label="Board Name"
        name="name"
      />
      <div class="columns">
        <label>Board Columns</label>
        <TransitionGroup name="list">
          <div v-for="(column, index) of newBoard.columns" :key="index" class="column-input">
            <input v-model="column.name" />
            <img src="./assets/images/icon-cross.svg" @click="newBoard.columns.splice(index, 1)" />
          </div>
        </TransitionGroup>
        <button type="button" @click="addColumn()" class="add-column-btn">+ Add New Column</button>
      </div>
      <button class="submit-btn" type="submit">Create New Board</button>
    </Form>
  </GenericDialog>
</template>

<script setup lang="ts">
import Navbar from '@/components/navbar.vue'
import Sidebar from '@/components/sidebar.vue'
import Columns from './components/columns.vue'
import { useThemeStore } from '@/stores/themeStore'
import { useBoardStore } from '@/stores/boardStore'
import { onMounted, ref } from 'vue'
import Toast from 'primevue/toast'
import GenericDialog from '@/components/generic-dialog.vue'
import * as Yup from 'yup'
import { Form } from 'vee-validate'
import GenericInput from '@/components/generic-input.vue'
import { useToast } from 'primevue/usetoast'
import type { Board } from './interfaces/board'

const toast = useToast()
const themeStore = useThemeStore()
const boardStore = useBoardStore()
const isDialogVisible = ref(false)

const newBoard = ref<Board>({
  name: '',
  columns: [
    { name: 'ToDo', tasks: [], color: '' },
    { name: 'Doing', tasks: [], color: '' }
  ]
})

const addColumn = () => {
  newBoard.value.columns.push({ name: '' })
}

const schema = Yup.object().shape({
  name: Yup.string().required(`Can't be empty`)
})

const onSubmit = (values: any) => {
  for (let board of boardStore.boards) {
    if (board.name === values.name) {
      toast.add({
        severity: 'info',
        detail: 'there is already a board with the name: ' + values.name,
        life: 3000
      })
      return
    }
  }

  newBoard.value.name = values.name
  boardStore.boards.push(newBoard.value)
  boardStore.isAddBoardVisible = false

  if (!boardStore.selectedBoard) {
    boardStore.selectedBoard = boardStore.boards[0]
  }
}

const openDialog = () => {
  newBoard.value = {
    name: '',
    columns: [
      { name: 'ToDo', tasks: [], color: '' },
      { name: 'Doing', tasks: [], color: '' }
    ]
  }
  isDialogVisible.value = true
}

onMounted(async () => {
  await boardStore.getBoards()
  boardStore.selectedBoard = boardStore.boards[0]
})
</script>

<style scoped lang="scss">
@import 'assets/sass/variables.scss';

main {
  display: flex;
}

.main-layout {
  background-color: var(--bodyBackground);
  height: 100vh;
  flex-grow: 1;
}
</style>
