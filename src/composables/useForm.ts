import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { FieldSchema, FormErrors, FormSchema, InferFormValues, ValidationMessages } from '../types'
import { computed, ref, shallowRef, toValue, watch } from 'vue'
import { createDefaultValues, getDefaultValue, getFields } from '../utils/schema'
import { shallowEqual } from '../utils/shallowEqual'
import { defaultMessages, validateField } from '../utils/validate'

export interface UseFormOptions<V> {
  /** Values merged over the schema defaults, read on creation and on `reset()`. */
  initialValues?: MaybeRefOrGetter<Partial<V> | undefined>
  /** Override the built-in error messages. Supports `{label}`, `{min}`, `{max}`. */
  messages?: MaybeRefOrGetter<Partial<ValidationMessages> | undefined>
}

export interface UseFormReturn<V extends Record<string, any> = Record<string, any>> {
  fields: ComputedRef<FieldSchema[]>
  values: Ref<V>
  errors: ComputedRef<FormErrors<V>>
  touched: Ref<Partial<Record<keyof V, boolean>>>
  submitCount: Ref<number>
  isSubmitting: Ref<boolean>
  isValid: ComputedRef<boolean>
  isDirty: ComputedRef<boolean>
  setFieldValue: <K extends keyof V>(name: K, value: V[K]) => void
  setTouched: (name: keyof V, touched?: boolean) => void
  reset: (values?: Partial<V>) => void
  handleSubmit: (
    onValid: (values: V) => unknown,
    onInvalid?: (errors: FormErrors<V>) => unknown,
  ) => (event?: Event) => Promise<void>
}

/**
 * Reactive form state driven by a schema: values, validation, dirty tracking and submission.
 *
 * @example
 * const { values, errors, handleSubmit } = useForm(schema)
 * const onSubmit = handleSubmit(values => api.save(values))
 */
export function useForm<S extends FormSchema>(
  schema: MaybeRefOrGetter<S>,
  options: UseFormOptions<InferFormValues<S>> = {},
): UseFormReturn<InferFormValues<S>> {
  type V = InferFormValues<S>

  const fields = computed(() => getFields(toValue(schema)))
  const messages = computed(() => ({ ...defaultMessages, ...toValue(options.messages) }))

  const initial = (overrides?: Partial<V>): V => ({
    ...createDefaultValues(toValue(schema)),
    ...toValue(options.initialValues),
    ...overrides,
  })

  const baseline = shallowRef(initial())
  const values = ref({ ...baseline.value }) as Ref<V>
  const touched = ref({}) as Ref<Partial<Record<keyof V, boolean>>>
  const submitCount = ref(0)
  const isSubmitting = ref(false)

  // Fields added to a reactive schema get their default value
  watch(fields, (list) => {
    const state = values.value as Record<string, unknown>
    for (const field of list) {
      if (!(field.name in state))
        state[field.name] = getDefaultValue(field)
    }
  })

  const errors = computed(() => {
    const result: FormErrors<V> = {}
    const state = values.value as Record<string, unknown>
    for (const field of fields.value) {
      const error = validateField(field, state[field.name], state, messages.value)
      if (error)
        result[field.name as keyof V] = error
    }
    return result
  })

  const isValid = computed(() => Object.keys(errors.value).length === 0)
  const isDirty = computed(() => !shallowEqual(values.value, baseline.value))

  function setFieldValue<K extends keyof V>(name: K, value: V[K]) {
    values.value[name] = value
  }

  function setTouched(name: keyof V, value = true) {
    touched.value[name] = value
  }

  function reset(overrides?: Partial<V>) {
    baseline.value = initial(overrides)
    values.value = { ...baseline.value }
    touched.value = {}
    submitCount.value = 0
  }

  function handleSubmit(onValid: (values: V) => unknown, onInvalid?: (errors: FormErrors<V>) => unknown) {
    return async (event?: Event) => {
      event?.preventDefault()
      submitCount.value++
      if (!isValid.value) {
        await onInvalid?.(errors.value)
        return
      }
      isSubmitting.value = true
      try {
        await onValid({ ...values.value })
      }
      finally {
        isSubmitting.value = false
      }
    }
  }

  return {
    fields,
    values,
    errors,
    touched,
    submitCount,
    isSubmitting,
    isValid,
    isDirty,
    setFieldValue,
    setTouched,
    reset,
    handleSubmit,
  }
}
