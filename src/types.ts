export interface BaseFieldSchema<T extends string = string> {
  type: T
  /** Key of the value in the form state. Must be unique within a schema. */
  name: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  /** CSS class applied to the field's column, defaults to `col-12`. */
  size?: string
  /** Custom rule run after the built-in ones. Return an error message to fail. */
  validate?: (value: any, values: Record<string, unknown>) => string | undefined | void
}

export interface TextFieldSchema extends BaseFieldSchema<'text' | 'email' | 'tel' | 'date'> {
  inputmode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email'
  autocomplete?: string
}

export interface NumberFieldSchema extends BaseFieldSchema<'number'> {
  min?: number
  max?: number
  step?: number
}

export interface CheckboxFieldSchema extends BaseFieldSchema<'checkbox'> {}

export interface SelectOption<V extends string | number = string | number> {
  text: string
  value: V
}

export interface SelectFieldSchema extends BaseFieldSchema<'select'> {
  options: readonly SelectOption[]
}

export type FieldSchema
  = | TextFieldSchema
    | NumberFieldSchema
    | CheckboxFieldSchema
    | SelectFieldSchema

export type FieldType = FieldSchema['type']

export interface FormRow {
  fields: readonly FieldSchema[]
}

export interface FormSchema {
  rows: readonly FormRow[]
}

interface FieldValueMap {
  text: string
  email: string
  tel: string
  date: string
  number: number | null
  checkbox: boolean
}

/** Value type of a single field, narrowed to the option values for selects. */
export type FieldValue<F extends FieldSchema>
  = F extends { type: 'select', options: readonly (infer O)[] }
    ? (O extends { value: infer V } ? V : never) | ''
    : F extends { type: infer T extends keyof FieldValueMap }
      ? FieldValueMap[T]
      : never

export type SchemaField<S extends FormSchema> = S['rows'][number]['fields'][number]

/** Shape of the form state described by a schema. */
export type InferFormValues<S extends FormSchema> = {
  [K in SchemaField<S>['name']]: FieldValue<Extract<SchemaField<S>, { name: K }>>
}

export type FormErrors<V> = Partial<Record<keyof V, string>>

export interface ValidationMessages {
  required: string
  email: string
  min: string
  max: string
}
