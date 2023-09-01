<template>
  <div :class="{ 'has-error': errorMessage }" class="input-field">
    <label :for="name">{{ label }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
    />

    <p class="error-message" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { toRef } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  value: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})

const name = toRef(props, 'name')

const {
  value: inputValue,
  errorMessage,
  handleChange
} = useField(name, undefined, {
  initialValue: props.value
})
</script>

<style scoped></style>
