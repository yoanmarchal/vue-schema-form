<script setup lang="ts">
import type { Component } from 'vue'
import type { FieldSchema } from '../types'
import { warn } from 'vue'
import { useField } from '../composables/useField'

const props = defineProps<{
  field: FieldSchema
  component?: Component
}>()

const { value, error, onBlur } = useField(() => props.field.name)

if (!props.component)
  warn(`[vite-form] No component registered for field type "${props.field.type}" (field "${props.field.name}").`)
</script>

<template>
  <component
    :is="component"
    v-if="component"
    v-model="value"
    :field="field"
    :error="error"
    @blur="onBlur"
  />
</template>
