<template>
  <main>
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
