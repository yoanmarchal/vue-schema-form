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
    <div class="custom-control custom-switch ml-2">
      <input
        v-model="model"
        v-bind="attrs"
        type="checkbox"
        class="custom-control-input"
        :class="{ 'is-invalid': error }"
        @blur="emit('blur')"
      >
      <label class="custom-control-label" :for="id">
        {{ field.label }}
        <span v-if="field.required" aria-hidden="true">*</span>
      </label>
      <div v-if="error" :id="errorId" class="invalid-feedback d-block">
        {{ error }}
      </div>
    </div>
  </div>
</template>
