<script setup lang="ts">
import type { NumberFieldSchema } from '../../types'
import { useFieldControl } from '../../composables/useFieldControl'
import FieldShell from './FieldShell.vue'

const props = defineProps<{
  field: NumberFieldSchema
  error?: string
}>()
const emit = defineEmits<{ blur: [] }>()
const model = defineModel<number | null>({ default: null })
const { id, errorId, attrs } = useFieldControl(props)

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  model.value = raw === '' ? null : Number(raw)
}
</script>

<template>
  <FieldShell :id="id" :field="field" :error="error" :error-id="errorId">
    <input
      v-bind="attrs"
      class="form-control"
      :class="{ 'is-invalid': error }"
      type="number"
      :value="model ?? ''"
      :placeholder="field.placeholder"
      :min="field.min"
      :max="field.max"
      :step="field.step"
      @input="onInput"
      @blur="emit('blur')"
    >
  </FieldShell>
</template>
