<script setup lang="ts">
import type { BaseFieldSchema } from '../../types'

defineProps<{
  field: BaseFieldSchema
  id: string
  errorId: string
  error?: string
}>()
</script>

<template>
  <div>
    <label :for="id">
      {{ field.label }}
      <span v-if="field.required" aria-hidden="true">*</span>
    </label>
    <slot />
    <div v-if="error" :id="errorId" class="invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>
