import type { BaseFieldSchema } from '../types'
import { computed, useId } from 'vue'

interface FieldControlProps {
  field: BaseFieldSchema
  error?: string
}

/** Accessible attributes shared by every built-in control. */
export function useFieldControl(props: FieldControlProps) {
  const id = useId()
  const errorId = `${id}-error`

  const attrs = computed(() => ({
    'id': id,
    'name': props.field.name,
    'required': props.field.required,
    'disabled': props.field.disabled,
    'aria-invalid': props.error ? true : undefined,
    'aria-describedby': props.error ? errorId : undefined,
  }))

  return { id, errorId, attrs }
}
