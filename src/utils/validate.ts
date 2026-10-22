import type { FieldSchema, ValidationMessages } from '../types'

export const defaultMessages: ValidationMessages = {
  required: '{label} is required',
  email: '{label} must be a valid email address',
  min: '{label} must be at least {min}',
  max: '{label} must be at most {max}',
}

const EMAIL_RE = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/

export function isEmpty(value: unknown): boolean {
  return value === '' || value === null || value === undefined || value === false
}

function format(template: string, params: object): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String((params as Record<string, unknown>)[key]) : match)
}

/** Returns the first error message for a field, or `undefined` when valid. */
export function validateField(
  field: FieldSchema,
  value: unknown,
  values: Record<string, unknown>,
  messages: ValidationMessages = defaultMessages,
): string | undefined {
  if (isEmpty(value))
    return field.required ? format(messages.required, field) : undefined

  if (field.type === 'email' && !EMAIL_RE.test(String(value)))
    return format(messages.email, field)

  if (field.type === 'number' && typeof value === 'number') {
    if (field.min !== undefined && value < field.min)
      return format(messages.min, field)
    if (field.max !== undefined && value > field.max)
      return format(messages.max, field)
  }

  return field.validate?.(value, values) || undefined
}
