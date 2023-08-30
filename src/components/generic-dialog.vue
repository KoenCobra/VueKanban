<template>
  <div v-if="props.isDialogVisible" class="dialog-container">
    <div class="dialog">
      <div class="dialog-header">
        <h2>{{ props.header }}</h2>
        <i @click="$emit('close')" class="fa-regular fa-x"></i>
      </div>
      <div class="dialog-body">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, libero? Voluptate, ad
        fugiat quam modi at ab provident veritatis sed necessitatibus maxime unde nulla consequatur
        voluptatibus eum? Et repudiandae impedit laudantium, voluptatum quisquam sit eius quis
        praesentium ipsum ipsam fugiat cum incidunt magnam a tempora aspernatur vero alias
        doloremque minus?
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['isDialogVisible', 'header'])
</script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.dialog-container {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  .dialog {
    background-color: var(--bodyBackground);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 480px;
    z-index: 2;
  }
}
</style>
