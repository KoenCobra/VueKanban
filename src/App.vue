<template>
  <main :class="{ dark: themeStore.isDarkMode }">
    <Sidebar />
    <div class="main-layout">
      <Navbar />
      <Columns />
    </div>
  </main>
</template>

<script setup lang="ts">
import Navbar from './components/navbar.vue'
import Sidebar from '@/components/sidebar.vue'
import { useThemeStore } from './stores/themeStore'
import { useBoardStore } from '@/stores/boardStore'
import { onMounted } from 'vue'

const themeStore = useThemeStore()
const boardStore = useBoardStore()

onMounted(async () => {
  await boardStore.getBoards()
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
