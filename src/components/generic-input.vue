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

<style scoped lang="scss">
@import '../assets/sass/variables.scss';
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: var(--labelColor);
    font-size: 0.75rem;
    font-weight: 700;
  }

  input {
    border-radius: 4px;
    border: 1px solid rgba(130, 143, 163, 0.25);
    background: transparent;
    padding: 0.5rem 1rem;
  }

  ::placeholder {
    color: var(--placeholderText);
    font-weight: 500;
    font-size: 0.8125rem;
    opacity: 0.4;
  }
}
</style>
