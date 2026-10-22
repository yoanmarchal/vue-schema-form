<script setup lang="ts">
import type { CheckboxFieldSchema } from '../../types'
import { useFieldControl } from '../../composables/useFieldControl'

const props = defineProps<{
  field: CheckboxFieldSchema
  error?: string
}>()
const emit = defineEmits<{ blur: [] }>()
const model = defineModel<boolean>({ default: false })
const { id, errorId, attrs } = useFieldControl(props)
</script>

<template>
  <div>
    <div class="form-check form-switch">
      <input
        v-model="model"
        v-bind="attrs"
        type="checkbox"
        class="form-check-input"
        role="switch"
        :class="{ 'is-invalid': error }"
        @blur="emit('blur')"
      >
      <label class="form-check-label" :for="id">
        {{ field.label }}
        <span v-if="field.required" aria-hidden="true">*</span>
      </label>
      <div v-if="error" :id="errorId" class="invalid-feedback d-block">
        {{ error }}
      </div>
    </div>
  </div>
</template>
