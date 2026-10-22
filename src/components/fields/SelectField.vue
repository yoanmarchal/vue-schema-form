<script setup lang="ts">
import type { SelectFieldSchema } from '../../types'
import { useFieldControl } from '../../composables/useFieldControl'
import FieldShell from './FieldShell.vue'

const props = defineProps<{
  field: SelectFieldSchema
  error?: string
}>()
const emit = defineEmits<{ blur: [] }>()
const model = defineModel<string | number>({ default: '' })
const { id, errorId, attrs } = useFieldControl(props)
</script>

<template>
  <FieldShell :id="id" :field="field" :error="error" :error-id="errorId">
    <select
      v-model="model"
      v-bind="attrs"
      class="custom-select"
      :class="{ 'is-invalid': error }"
      @blur="emit('blur')"
    >
      <option value="" disabled>
        {{ field.placeholder ?? 'Choose...' }}
      </option>
      <option v-for="option in field.options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </FieldShell>
</template>
