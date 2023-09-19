<template>
  <Transition>
    <div @click="handleClick($event)" v-if="props.isDialogVisible" class="dialog-container">
      <div class="dialog">
        <div class="dialog-header" v-if="isCloseBtnVisible">
          <h2 :class="props.headerClass">{{ props.header }}</h2>
          <img @click="$emit('close')" src="../assets/images/icon-cross.svg" alt="" />
        </div>
        <div class="dialog-body">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps({
  header: {
    type: String
  },
  isDialogVisible: {
    type: Boolean,
    default: false
  },
  headerClass: {
    type: String,
    default: undefined
  },
  isCloseBtnVisible: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['close'])

const handleClick = (event: any) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.dialog-container {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 1;
  color: var(--textColor);

  .dialog {
    background-color: var(--dialogBackground);
    width: 480px;
    z-index: 2;
    padding: 2rem;
    border-radius: 6px;
    position: relative;

    .dialog-header {
      font-weight: 700;
      font-size: 1.125rem;
      margin-bottom: 1.5rem;

      img {
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 20px;
      }
    }

    .dialog-body {
      color: var(--mediumGrey);
      font-size: 0.8125rem;
      font-weight: 500;
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
}

.v-enter-active .dialog,
.v-leave-active .dialog {
  transition: all 0.2s ease-out;
}

.v-enter-from .dialog,
.v-leave-to .dialog {
  transform: scale(0.7);
}
</style>
