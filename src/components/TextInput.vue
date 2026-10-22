<script setup>
import { useId } from 'vue'

defineProps({
  field: { type: Object, required: true },
  modelValue: { type: String, default: '' },
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
    <input
      :id="id" class="input form-control" type="text" :name="field.name" :placeholder="field.placeholder"
      :required="field.required" :value="modelValue" @input="emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>
