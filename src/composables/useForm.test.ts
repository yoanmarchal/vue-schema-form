import type { FormSchema } from '../types'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { defineSchema } from '../utils/schema'
import { useForm } from './useForm'

const schema = defineSchema({
  rows: [{
    fields: [
      { type: 'email', name: 'mail', label: 'Mail', required: true },
      { type: 'checkbox', name: 'nl', label: 'Newsletter' },
      { type: 'number', name: 'age', label: 'Age', min: 18 },
    ],
  }],
})

describe('useForm', () => {
  it('starts from schema defaults', () => {
    const { values } = useForm(schema)
    expect(values.value).toEqual({ mail: '', nl: false, age: null })
  })

  it('types values from the schema', () => {
    const { values, setFieldValue } = useForm(schema)
    expectTypeOf(values.value.mail).toEqualTypeOf<string>()
    expectTypeOf(values.value.age).toEqualTypeOf<number | null>()
    expectTypeOf(setFieldValue<'nl'>).parameter(1).toEqualTypeOf<boolean>()
  })

  it('merges initial values over defaults, from a getter', () => {
    const initial = ref({ mail: 'a@b.fr' })
    const { values } = useForm(schema, { initialValues: () => initial.value })
    expect(values.value).toEqual({ mail: 'a@b.fr', nl: false, age: null })
  })

  it('exposes flattened fields', () => {
    const { fields } = useForm(schema)
    expect(fields.value.map(f => f.name)).toEqual(['mail', 'nl', 'age'])
  })

  it('validates reactively', () => {
    const { errors, isValid, setFieldValue } = useForm(schema)
    expect(errors.value).toEqual({ mail: 'Mail is required' })
    expect(isValid.value).toBe(false)

    setFieldValue('mail', 'a@b.fr')
    setFieldValue('age', 12)
    expect(errors.value).toEqual({ age: 'Age must be at least 18' })

    setFieldValue('age', 30)
    expect(isValid.value).toBe(true)
  })

  it('accepts reactive custom messages', () => {
    const messages = ref({ required: 'obligatoire' })
    const { errors } = useForm(schema, { messages })
    expect(errors.value.mail).toBe('obligatoire')
    messages.value = { required: '{label} requis' }
    expect(errors.value.mail).toBe('Mail requis')
  })

  it('tracks dirty state against the baseline', () => {
    const { isDirty, setFieldValue } = useForm(schema)
    expect(isDirty.value).toBe(false)
    setFieldValue('nl', true)
    expect(isDirty.value).toBe(true)
    setFieldValue('nl', false)
    expect(isDirty.value).toBe(false)
  })

  it('tracks touched fields', () => {
    const { touched, setTouched } = useForm(schema)
    setTouched('mail')
    expect(touched.value).toEqual({ mail: true })
    setTouched('mail', false)
    expect(touched.value).toEqual({ mail: false })
  })

  it('resets values, touched and submit count', async () => {
    const form = useForm(schema, { initialValues: { mail: 'init@b.fr' } })
    form.setFieldValue('mail', 'changed@b.fr')
    form.setTouched('mail')
    await form.handleSubmit(() => {})()

    form.reset()
    expect(form.values.value.mail).toBe('init@b.fr')
    expect(form.touched.value).toEqual({})
    expect(form.submitCount.value).toBe(0)
    expect(form.isDirty.value).toBe(false)
  })

  it('resets to new values that become the baseline', () => {
    const form = useForm(schema)
    form.reset({ mail: 'new@b.fr' })
    expect(form.values.value.mail).toBe('new@b.fr')
    expect(form.isDirty.value).toBe(false)
  })

  describe('handleSubmit', () => {
    it('calls onValid with a copy of the values', async () => {
      const form = useForm(schema, { initialValues: { mail: 'a@b.fr' } })
      const onValid = vi.fn()
      await form.handleSubmit(onValid)()
      expect(onValid).toHaveBeenCalledWith({ mail: 'a@b.fr', nl: false, age: null })
      expect(onValid.mock.calls[0]![0]).not.toBe(form.values.value)
      expect(form.submitCount.value).toBe(1)
    })

    it('calls onInvalid with errors and skips onValid', async () => {
      const form = useForm(schema)
      const onValid = vi.fn()
      const onInvalid = vi.fn()
      await form.handleSubmit(onValid, onInvalid)()
      expect(onValid).not.toHaveBeenCalled()
      expect(onInvalid).toHaveBeenCalledWith({ mail: 'Mail is required' })
    })

    it('prevents the native submit', async () => {
      const form = useForm(schema)
      const event = new Event('submit', { cancelable: true })
      await form.handleSubmit(() => {})(event)
      expect(event.defaultPrevented).toBe(true)
    })

    it('flags isSubmitting while an async handler runs', async () => {
      const form = useForm(schema, { initialValues: { mail: 'a@b.fr' } })
      let resolve!: () => void
      const pending = form.handleSubmit(() => new Promise<void>(r => (resolve = r)))()
      await nextTick()
      expect(form.isSubmitting.value).toBe(true)
      resolve()
      await pending
      expect(form.isSubmitting.value).toBe(false)
    })

    it('clears isSubmitting when the handler throws', async () => {
      const form = useForm(schema, { initialValues: { mail: 'a@b.fr' } })
      await expect(form.handleSubmit(() => Promise.reject(new Error('boom')))()).rejects.toThrow('boom')
      expect(form.isSubmitting.value).toBe(false)
    })
  })

  it('adds defaults for fields added to a reactive schema', async () => {
    const dynamic = ref<FormSchema>({ rows: [{ fields: [{ type: 'text', name: 'a', label: 'A' }] }] })
    const { values } = useForm(dynamic)
    ;(values.value as Record<string, unknown>).a = 'kept'
    dynamic.value = {
      rows: [{ fields: [{ type: 'text', name: 'a', label: 'A' }, { type: 'checkbox', name: 'b', label: 'B' }] }],
    }
    await nextTick()
    expect(values.value).toEqual({ a: 'kept', b: false })
  })
})
