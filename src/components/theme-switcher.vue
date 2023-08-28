<template>
  <div class="theme-switch">
    <img src="../assets/images/icon-light-theme.svg" alt="light-theme" />
    <input type="checkbox" />
    <img src="../assets/images/icon-dark-theme.svg" alt="dark-theme" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: var(--lightGrey);
  padding: 1rem 0;
  border-radius: 6px;
}
</style>
