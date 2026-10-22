<script setup lang="ts">
import type { TextFieldSchema } from '../../types'
import { useFieldControl } from '../../composables/useFieldControl'
import FieldShell from './FieldShell.vue'

const props = defineProps<{
  field: TextFieldSchema
  error?: string
}>()
const emit = defineEmits<{ blur: [] }>()
const model = defineModel<string>({ default: '' })
const { id, errorId, attrs } = useFieldControl(props)
</script>

<template>
  <FieldShell :id="id" :field="field" :error="error" :error-id="errorId">
    <input
      v-model="model"
      v-bind="attrs"
      class="form-control"
      :class="{ 'is-invalid': error }"
      :type="field.type"
      :placeholder="field.placeholder"
      :inputmode="field.inputmode"
      :autocomplete="field.autocomplete"
      @blur="emit('blur')"
    >
  </FieldShell>
</template>
