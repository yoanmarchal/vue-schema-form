import type { ComputedRef, MaybeRefOrGetter, WritableComputedRef } from 'vue'
import type { FieldSchema } from '../types'
import { computed, toValue } from 'vue'
import { injectForm } from './context'

export interface UseFieldReturn<T> {
  value: WritableComputedRef<T>
  field: ComputedRef<FieldSchema | undefined>
  /** Error message, only exposed once the field was blurred or the form submitted. */
  error: ComputedRef<string | undefined>
  touched: ComputedRef<boolean>
  onBlur: () => void
}

/**
 * Binds to one field of the closest form provided by `<SchemaForm>` or `provideForm()`.
 *
 * @example
 * const { value, error, onBlur } = useField<string>('mail')
 */
export function useField<T = unknown>(name: MaybeRefOrGetter<string>): UseFieldReturn<T> {
  const form = injectForm()

  const value = computed<T>({
    get: () => form.values.value[toValue(name)],
    set: next => form.setFieldValue(toValue(name), next),
  })
  const field = computed(() => form.fields.value.find(f => f.name === toValue(name)))
  const touched = computed(() => !!form.touched.value[toValue(name)])
  const error = computed(() =>
    touched.value || form.submitCount.value > 0 ? form.errors.value[toValue(name)] : undefined,
  )

  return {
    value,
    field,
    error,
    touched,
    onBlur: () => form.setTouched(toValue(name)),
  }
}
