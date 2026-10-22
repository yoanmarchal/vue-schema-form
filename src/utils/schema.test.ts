import type { InferFormValues } from '../types'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { createDefaultValues, defineSchema, getDefaultValue, getFields } from './schema'

const schema = defineSchema({
  rows: [
    { fields: [{ type: 'text', name: 'name', label: 'Name' }, { type: 'email', name: 'mail', label: 'Mail' }] },
    {
      fields: [
        { type: 'number', name: 'age', label: 'Age' },
        { type: 'checkbox', name: 'nl', label: 'Newsletter' },
        { type: 'select', name: 'civ', label: 'Civ', options: [{ text: 'M.', value: 'M' }, { text: 'Mme', value: 'Mme' }] },
        { type: 'date', name: 'bd', label: 'Birthday' },
        { type: 'tel', name: 'phone', label: 'Phone' },
      ],
    },
  ],
})

describe('defineSchema', () => {
  it('returns the schema untouched', () => {
    const input = { rows: [] }
    expect(defineSchema(input)).toBe(input)
  })

  it('infers value types from field types', () => {
    expectTypeOf<InferFormValues<typeof schema>>().toEqualTypeOf<{
      name: string
      mail: string
      age: number | null
      nl: boolean
      civ: 'M' | 'Mme' | ''
      bd: string
      phone: string
    }>()
  })
})

describe('getFields', () => {
  it('flattens rows in order', () => {
    expect(getFields(schema).map(f => f.name)).toEqual(['name', 'mail', 'age', 'nl', 'civ', 'bd', 'phone'])
  })
})

describe('getDefaultValue', () => {
  it.each([
    ['text', ''],
    ['email', ''],
    ['date', ''],
    ['tel', ''],
    ['number', null],
    ['checkbox', false],
  ] as const)('%s -> %o', (type, expected) => {
    expect(getDefaultValue({ type, name: 'x', label: 'X' })).toBe(expected)
  })

  it('select -> empty string', () => {
    expect(getDefaultValue({ type: 'select', name: 'x', label: 'X', options: [] })).toBe('')
  })
})

describe('createDefaultValues', () => {
  it('builds an empty state for every field', () => {
    expect(createDefaultValues(schema)).toEqual({
      name: '',
      mail: '',
      age: null,
      nl: false,
      civ: '',
      bd: '',
      phone: '',
    })
  })
})
