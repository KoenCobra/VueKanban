<template>
  <div
    class="sidebar"
    :class="[{ active: !boardStore.isSideBarVisible }, props.isDropdown ? 'mobile-dropdown' : '']"
  >
    <div>
      <div class="logo">
        <div class="logo-img" :class="{ dark: themeStore.isDarkMode }"></div>
      </div>
      <div class="sidebar-title">
        <p>ALL BOARDS ({{ boardStore.boards.length }})</p>
      </div>
      <div class="board-list">
        <ul>
          <li
            @click="boardStore.selectedBoard = board"
            v-for="board of boardStore.boards"
            :key="board.name"
            :class="{ active: boardStore.selectedBoard?.name === board.name }"
          >
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
                fill="#828FA3"
              />
            </svg>
            {{ board.name }}
          </li>
        </ul>
        <button class="new-board-btn" @click="openAddBoardDialog">
          <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z"
              fill="#828FA3"
            />
          </svg>
          +Create New Board
        </button>
      </div>
    </div>

    <div class="sidebar-footer">
      <ThemeSwitcher />
      <button class="hide-sidebar-btn" @click="boardStore.isSideBarVisible = false">
        <img src="../assets/images/icon-hide-sidebar.svg" alt="hide-sidebar" />Hide Sidebar
      </button>
    </div>
  </div>
  <button
    @click="boardStore.isSideBarVisible = true"
    v-if="!boardStore.isSideBarVisible"
    class="show-sidebar-btn"
  >
    <img src="../assets/images/icon-show-sidebar.svg" alt="" />
  </button>
</template>

<script setup lang="ts">
import ThemeSwitcher from '@/components/theme-switcher.vue'
import { useThemeStore } from '@/stores/themeStore'
import { useBoardStore } from '@/stores/boardStore'

const boardStore = useBoardStore()
const themeStore = useThemeStore()

const props = defineProps({
  isDropdown: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['openAddBoardDialog'])

const openAddBoardDialog = () => {
  boardStore.isAddBoardVisible = true
  emit('openAddBoardDialog')
}
</script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';

.sidebar {
  background-color: var(--darkGreyBackground);
  height: 100vh;
  border-right: 1px solid var(--lines);
  padding: 0 2rem 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: margin 0.2s ease-in-out;
  width: 18.75rem;
  margin-left: 0;

  @media (max-width: 800px) {
    display: none;

    &.mobile-dropdown {
      display: block;
      height: max-content;
      border-radius: 8px;
      box-shadow:
        rgba(0, 0, 0, 0.25) 0px 54px 55px,
        rgba(0, 0, 0, 0.12) 0px -12px 30px,
        rgba(0, 0, 0, 0.12) 0px 4px 6px,
        rgba(0, 0, 0, 0.17) 0px 12px 13px,
        rgba(0, 0, 0, 0.09) 0px -3px 5px;

      .logo-img {
        display: none;
      }

      .hide-sidebar-btn {
        display: none !important;
      }

      .board-list {
        margin-bottom: 1rem;
      }
    }
  }

  &.active {
    margin-left: -18.75rem;
  }
  .logo {
    padding: 2rem 2rem 0;
  }

  .logo-img {
    background-image: url('../assets/images/logo-dark.svg');
    background-repeat: no-repeat;
    width: 160.528px;
    height: 25.224px;
    margin-bottom: 3.375rem;

    &.dark {
      background-image: url('../assets/images/logo-light.svg');
    }
  }

  .sidebar-title {
    padding: 0 0 1rem 2rem;
    color: var(--mediumGrey);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2.4px;
  }
  .board-list {
    ul {
      display: flex;
      flex-direction: column;

      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: $transition;
        font-size: 0.9375rem;
        padding: 1rem 2rem;
        font-weight: 700;
        border-radius: 0 100vh 100vh 0;
        color: var(--mediumGrey);
        cursor: pointer;

        &.active {
          background-color: var(--mainPurple);
          svg path {
            fill: var(--white);
          }
          color: var(--white);
        }

        &:hover:not(.active) {
          background-color: rgba(#635fc7, 0.1);
          color: var(--mainPurple);
        }
      }
    }

    .new-board-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0 0 2rem;
      color: var(--mainPurple);
      font-size: 0.9375rem;
      font-weight: 700;

      svg path {
        fill: var(--mainPurple);
      }
    }
  }
  .sidebar-footer {
    padding-left: 2rem;

    .hide-sidebar-btn {
      display: flex;
      align-items: center;
      gap: 0.9375rem;
      margin-top: 1.15rem;
      color: var(--mediumGrey);
      font-size: 0.9375rem;
      font-weight: 700;
    }
  }
}

label {
  color: var(--labelColor);
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.show-sidebar-btn {
  position: absolute;
  bottom: 2rem;
  left: 0;
  padding: 1.5rem;
  background-color: var(--mainPurple);
  border-radius: 0 100vh 100vh 0;
}
</style>
