<script setup lang="ts" generic="S extends FormSchema">
import type { UseFormReturn } from '../composables/useForm'
import type { FieldComponents } from '../registry'
import type { FieldSchema, FormErrors, FormSchema, InferFormValues, ValidationMessages } from '../types'
import { watch } from 'vue'
import { provideForm } from '../composables/context'
import { useForm } from '../composables/useForm'
import { useFieldComponents } from '../registry'
import { shallowEqual } from '../utils/shallowEqual'
import SchemaFormField from './SchemaFormField.vue'

type Values = InferFormValues<S>

const props = defineProps<{
  schema: S
  /** Per-instance field components, merged over the app registry. */
  fields?: FieldComponents
  messages?: Partial<ValidationMessages>
}>()

const emit = defineEmits<{
  submit: [values: Values]
  invalid: [errors: FormErrors<Values>]
}>()

defineSlots<{
  default?: (props: { form: UseFormReturn<Values> }) => any
  [name: `field:${string}`]: (props: { field: FieldSchema, form: UseFormReturn<Values> }) => any
}>()

const model = defineModel<Partial<Values>>()

const form = useForm(() => props.schema, {
  // Snapshot: model follows user input, reset() must return to the mount-time values
  initialValues: { ...model.value },
  messages: () => props.messages,
})
provideForm(form)

const components = useFieldComponents(() => props.fields)

watch(model, (next) => {
  if (next && !shallowEqual(next, form.values.value))
    Object.assign(form.values.value, next)
}, { deep: true })

watch(form.values, (next) => {
  if (!shallowEqual(next, model.value))
    model.value = { ...next }
}, { deep: true })

const onSubmit = form.handleSubmit(
  values => emit('submit', values),
  errors => emit('invalid', errors),
)

defineExpose(form)
</script>

<template>
  <form novalidate @submit="onSubmit" @reset.prevent="form.reset()">
    <div v-for="(row, index) in schema.rows" :key="index" class="row g-3 mb-3">
      <template v-for="field in row.fields" :key="field.name">
        <slot :name="`field:${field.name}`" :field="field" :form="form">
          <SchemaFormField
            :field="field"
            :component="components[field.type]"
            :class="field.size ?? 'col-12'"
          />
        </slot>
      </template>
    </div>
    <slot :form="form" />
  </form>
</template>
