<script setup>
import { reactive, watch } from 'vue'
import CheckboxInput from './CheckboxInput.vue'
import DateInput from './DateInput.vue'
import EmailInput from './EmailInput.vue'
import NumberInput from './NumberInput.vue'
import SelectInput from './SelectInput.vue'
import TextInput from './TextInput.vue'

const props = defineProps({
  schema: { type: Object, required: true },
  data: { type: Object, required: true },
})

const emit = defineEmits(['updatedForm', 'submit'])

const components = {
  'text-input': TextInput,
  'email-input': EmailInput,
  'number-input': NumberInput,
  'date-input': DateInput,
  'checkbox-input': CheckboxInput,
  'select-input': SelectInput,
}

const values = reactive({ ...props.data })
watch(() => props.data, data => Object.assign(values, data), { deep: true })

function onUpdate(fieldName, value) {
  values[fieldName] = value
  emit('updatedForm', { ...values })
}
</script>

<template>
  <form novalidate @submit.prevent="emit('submit', { ...values })">
    <div v-for="(row, index) in schema.rows" :key="index" class="form-row">
      <component
        :is="components[field.type]" v-for="field in row.fields" :key="field.name" :field="field"
        :model-value="values[field.name]" :class="field.size ?? 'col-12'"
        @update:model-value="onUpdate(field.name, $event)"
      />
    </div>
    <slot />
  </form>
</template>
