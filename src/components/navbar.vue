<template>
  <div class="navbar">
    <div class="logo">
      <div class="logo-title">
        <h1>Platform Launch</h1>
        <p></p>
      </div>
    </div>
    <div class="navbar-btns">
      <button class="add-new-task-btn">+ Add New Task</button>
      <button @click="isCrudDropdownVisble = !isCrudDropdownVisble" ref="dropdownToggleBtn">
        <img src="../assets/images/icon-vertical-ellipsis.svg" alt="ellipsis" />
      </button>

      <Transition>
        <div v-if="isCrudDropdownVisble" class="crud-dropdown">
          <p>Edit Board</p>
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
    Are you sure you want to delete the ‘{{ boardStore.selectedBoard?.name }}’ board? This action
    will remove all columns and tasks and cannot be reversed.

    <div class="remove-board-footer">
      <button @click="deleteBoard" class="delete-board-btn">Delete</button>
      <button @click="isDeleteBoardConfirmationVisible = false" class="cancel-delete-board-btn">
        Cancel
      </button>
    </div>
  </GenericDialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import GenericDialog from '@/components/generic-dialog.vue'
import { useBoardStore } from '@/stores/boardStore'

const isCrudDropdownVisble = ref(false)
const isDeleteBoardConfirmationVisible = ref(false)
const dropdownToggleBtn = ref()
const boardStore = useBoardStore()

const handleClickOutside = (event: any) => {
  if (
    dropdownToggleBtn.value &&
    !dropdownToggleBtn.value.contains(event.target) &&
    isCrudDropdownVisble.value
  ) {
    isCrudDropdownVisble.value = false
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
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--textColor);
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
      background-color: var(--white);
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
        color: var(--red);
      }
    }
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.2s ease-out;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
    transform: scale(0.7);
  }
}
</style>
