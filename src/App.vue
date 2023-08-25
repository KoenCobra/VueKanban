<template>
  <main>
    <Navbar />
    <div class="main-layout">
      <Sidebar />
      <Columns />
    </div>
  </main>
</template>

<script setup lang="ts">
import Navbar from './components/navbar.vue'
</script>

<style scoped lang="scss">
@import 'assets/sass/variables.scss';

.main-layout {
  background-color: var(--bodyBackground);
  height: calc(100vh - 94.5px);
}
</style>
