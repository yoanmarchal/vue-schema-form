import type { FieldSchema } from '../types'
import { describe, expect, it, vi } from 'vitest'
import { defaultMessages, isEmpty, validateField } from './validate'

describe('isEmpty', () => {
  it.each(['', null, undefined, false])('%o is empty', (value) => {
    expect(isEmpty(value)).toBe(true)
  })

  it.each([0, 'a', true, ' '])('%o is not empty', (value) => {
    expect(isEmpty(value)).toBe(false)
  })
})

describe('validateField', () => {
  const text: FieldSchema = { type: 'text', name: 'name', label: 'Name' }

  it('accepts an empty optional field', () => {
    expect(validateField(text, '', {})).toBeUndefined()
  })

  it('rejects an empty required field', () => {
    expect(validateField({ ...text, required: true }, '', {})).toBe('Name is required')
  })

  it('requires checkboxes to be checked', () => {
    const field: FieldSchema = { type: 'checkbox', name: 'ok', label: 'Consent', required: true }
    expect(validateField(field, false, {})).toBe('Consent is required')
    expect(validateField(field, true, {})).toBeUndefined()
  })

  it('treats 0 as a filled number', () => {
    expect(validateField({ type: 'number', name: 'n', label: 'N', required: true }, 0, {})).toBeUndefined()
  })

  it.each(['a@b.fr', 'first.last@sub.domain.com'])('accepts email %s', (value) => {
    expect(validateField({ type: 'email', name: 'm', label: 'Mail' }, value, {})).toBeUndefined()
  })

  it.each(['a', 'a@b', 'a b@c.fr', '@b.fr'])('rejects email %s', (value) => {
    expect(validateField({ type: 'email', name: 'm', label: 'Mail' }, value, {})).toBe('Mail must be a valid email address')
  })

  it('checks number bounds', () => {
    const field: FieldSchema = { type: 'number', name: 'age', label: 'Age', min: 18, max: 99 }
    expect(validateField(field, 17, {})).toBe('Age must be at least 18')
    expect(validateField(field, 100, {})).toBe('Age must be at most 99')
    expect(validateField(field, 18, {})).toBeUndefined()
    expect(validateField(field, 99, {})).toBeUndefined()
  })

  it('runs the custom rule with value and all values', () => {
    const validate = vi.fn((value: string) => (value === 'bad' ? 'Nope' : undefined))
    const field: FieldSchema = { ...text, validate }
    expect(validateField(field, 'bad', { name: 'bad', other: 1 })).toBe('Nope')
    expect(validate).toHaveBeenCalledWith('bad', { name: 'bad', other: 1 })
    expect(validateField(field, 'good', {})).toBeUndefined()
  })

  it('skips the custom rule when built-in rules fail', () => {
    const validate = vi.fn(() => 'custom')
    validateField({ ...text, required: true, validate }, '', {})
    expect(validate).not.toHaveBeenCalled()
  })

  it('uses custom messages and leaves unknown placeholders intact', () => {
    const messages = { ...defaultMessages, required: '{label} manquant {unknown}' }
    expect(validateField({ ...text, required: true }, '', {}, messages)).toBe('Name manquant {unknown}')
  })
})
