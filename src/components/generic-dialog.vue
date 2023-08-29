<template>
  <Dialog
    @update:visible="hideHandler"
    v-bind:visible="props.modelValue"
    modal
    :header="props.header"
  >
    <div class="dialog-body">
      <slot />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'

const props = defineProps(['modelValue', 'header'])
const emit = defineEmits(['update:modelValue'])

function hideHandler(value: any) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss"></style>
