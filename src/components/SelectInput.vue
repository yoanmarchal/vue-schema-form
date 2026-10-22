<script setup>
import { useId } from 'vue'

defineProps({
  field: { type: Object, required: true },
  modelValue: { type: [String, Number], default: '' },
})
const emit = defineEmits(['update:modelValue'])
const id = useId()
</script>

<template>
  <div>
    <label :for="id">
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <select
      :id="id" class="custom-select" :name="field.name" :required="field.required" :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>
        {{ field.placeholder ?? 'Choose...' }}
      </option>
      <option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>
