<template>
  <div class="navbar">
    <div class="logo">
      <div class="logo-img"></div>
      <div class="logo-title">
        <h1>Platform Launch</h1>
      </div>
    </div>
    <div class="navbar-btns">
      <button class="add-new-task-btn"></button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 1.25rem 2rem;
}
.logo {
  display: flex;
  align-items: center;
  gap: 3.875rem;
  .logo-img {
    background-image: var(--logo);
    background-repeat: no-repeat;
    width: 160.528px;
    height: 25.224px;
  }
  .logo-title {
    h1 {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}
</style>
