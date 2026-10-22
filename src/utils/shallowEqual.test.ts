import { describe, expect, it } from 'vitest'
import { shallowEqual } from './shallowEqual'

describe('shallowEqual', () => {
  it('is true for the same reference', () => {
    const a = { x: 1 }
    expect(shallowEqual(a, a)).toBe(true)
  })

  it('compares own keys with Object.is', () => {
    expect(shallowEqual({ a: 1, b: 'x' }, { b: 'x', a: 1 })).toBe(true)
    expect(shallowEqual({ a: Number.NaN }, { a: Number.NaN })).toBe(true)
    expect(shallowEqual({ a: 1 }, { a: '1' })).toBe(false)
  })

  it('detects different key sets', () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(shallowEqual({ a: 1, b: undefined }, { a: 1, c: undefined })).toBe(false)
  })

  it('does not recurse', () => {
    expect(shallowEqual({ a: {} }, { a: {} })).toBe(false)
  })

  it('handles nullish values', () => {
    expect(shallowEqual(null, null)).toBe(true)
    expect(shallowEqual({}, null)).toBe(false)
    expect(shallowEqual(undefined, {})).toBe(false)
  })
})
