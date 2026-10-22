import type { UseFieldReturn } from './useField'
import type { UseFormReturn } from './useForm'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { defineSchema } from '../utils/schema'
import { provideForm } from './context'
import { useField } from './useField'
import { useForm } from './useForm'

const schema = defineSchema({
  rows: [{ fields: [{ type: 'email', name: 'mail', label: 'Mail', required: true }] }],
})

function setup() {
  let form!: UseFormReturn<any>
  let field!: UseFieldReturn<string>
  const Child = defineComponent({
    setup() {
      field = useField<string>('mail')
      return () => null
    },
  })
  mount(defineComponent({
    setup() {
      form = useForm(schema)
      provideForm(form)
      return () => h(Child)
    },
  }))
  return { form, field }
}

describe('useField', () => {
  it('throws outside of a form', () => {
    const Orphan = defineComponent({
      setup() {
        useField('mail')
        return () => null
      },
    })
    expect(() => mount(Orphan)).toThrow(/must be used inside <SchemaForm>/)
  })

  it('reads and writes the form value', () => {
    const { form, field } = setup()
    field.value.value = 'a@b.fr'
    expect(form.values.value.mail).toBe('a@b.fr')
    form.setFieldValue('mail', 'c@d.fr')
    expect(field.value.value).toBe('c@d.fr')
  })

  it('resolves the field schema', () => {
    const { field } = setup()
    expect(field.field.value?.label).toBe('Mail')
  })

  it('hides errors until the field is blurred', () => {
    const { field } = setup()
    expect(field.error.value).toBeUndefined()
    field.onBlur()
    expect(field.touched.value).toBe(true)
    expect(field.error.value).toBe('Mail is required')
  })

  it('shows errors after a submit attempt', async () => {
    const { form, field } = setup()
    await form.handleSubmit(() => {})()
    expect(field.error.value).toBe('Mail is required')
  })
})
