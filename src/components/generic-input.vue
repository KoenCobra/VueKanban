<template>
  <div :class="{ 'has-error': errorMessage }" class="input-field">
    <label :for="name">{{ label }}</label>
    <div class="input-error-container">
      <input
        v-if="!isTextArea"
        :name="name"
        :id="name"
        :type="type"
        :value="inputValue"
        :placeholder="placeholder"
        @input="handleChange"
      />

      <textarea
        v-if="isTextArea"
        :name="name"
        :id="name"
        :type="type"
        :value="inputValue"
        :placeholder="placeholder"
        @input="handleChange"
        rows="3"
      ></textarea>

      <p class="error-message" v-show="errorMessage">
        {{ errorMessage }}
      </p>
    </div>
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
  isTextArea: {
    type: Boolean,
    default: false
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

  &.has-error {
    input {
      border: 1px solid var(--red) !important;
    }
  }

  label {
    color: var(--labelColor);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .input-error-container {
    position: relative;
    input {
      width: 100%;
      border-radius: 4px;
      border: 0;
      outline: 1px solid rgba(130, 143, 163, 0.25);
      background: transparent;
      padding: 0.5rem 1rem;
      color: var(--textColor);
      font-size: 0.8125rem;
      font-weight: 500;

      &:focus-within {
        outline: 1px solid rgba(130, 143, 163, 0.25);
      }
    }

    .error-message {
      color: var(--red);
      top: 0;
      right: 0.5rem;
      transform: translateY(50%);
      position: absolute;
      font-size: 0.8125rem;
      font-weight: 500;
    }
  }
}
</style>
