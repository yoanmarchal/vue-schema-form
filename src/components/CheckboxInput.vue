<template>
  <div>
    <div class="custom-control custom-switch ml-2">
      <input :id="id" type="checkbox" class="custom-control-input" :name="field.name" :required="field.required"
        :checked="modelValue" @change="emit('update:modelValue', $event.target.checked)">
      <label class="custom-control-label" :for="id">
        {{ field.label }}
        <span v-if="field.required">*</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  field: { type: Object, required: true },
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])
const id = useId()
</script>
