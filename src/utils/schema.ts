import type { FieldSchema, FieldValue, FormSchema, InferFormValues } from '../types'

/**
 * Identity helper that keeps literal types so values can be inferred.
 *
 * @example
 * const schema = defineSchema({ rows: [{ fields: [{ type: 'email', name: 'mail', label: 'Email' }] }] })
 * // InferFormValues<typeof schema> -> { mail: string }
 */
export function defineSchema<const S extends FormSchema>(schema: S): S {
  return schema
}

export function getFields(schema: FormSchema): FieldSchema[] {
  return schema.rows.flatMap(row => row.fields)
}

export function getDefaultValue<F extends FieldSchema>(field: F): FieldValue<F> {
  switch (field.type) {
    case 'checkbox':
      return false as FieldValue<F>
    case 'number':
      return null as FieldValue<F>
    default:
      return '' as FieldValue<F>
  }
}

/** Builds an empty state for every field of the schema. */
export function createDefaultValues<S extends FormSchema>(schema: S): InferFormValues<S> {
  const values: Record<string, unknown> = {}
  for (const field of getFields(schema))
    values[field.name] = getDefaultValue(field)
  return values as InferFormValues<S>
}
