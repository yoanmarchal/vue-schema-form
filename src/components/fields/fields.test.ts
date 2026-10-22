import type { Component } from 'vue'
import type { FieldSchema } from '../../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import CheckboxField from './CheckboxField.vue'
import NumberField from './NumberField.vue'
import SelectField from './SelectField.vue'
import TextField from './TextField.vue'

interface Case {
  name: string
  component: Component
  field: FieldSchema
  control: string
  empty: unknown
  value: unknown
  set: unknown
}

const cases: Case[] = [
  { name: 'text', component: TextField, field: { type: 'text', name: 'f', label: 'Label' }, control: 'input', empty: '', value: 'Marchal', set: 'Marchal' },
  { name: 'email', component: TextField, field: { type: 'email', name: 'f', label: 'Label' }, control: 'input', empty: '', value: 'a@b.fr', set: 'a@b.fr' },
  { name: 'date', component: TextField, field: { type: 'date', name: 'f', label: 'Label' }, control: 'input', empty: '', value: '2020-01-31', set: '2020-01-31' },
  { name: 'number', component: NumberField, field: { type: 'number', name: 'f', label: 'Label' }, control: 'input', empty: null, value: 42, set: '42' },
  { name: 'select', component: SelectField, field: { type: 'select', name: 'f', label: 'Label', options: [{ text: 'A', value: 'a' }] }, control: 'select', empty: '', value: 'a', set: 'a' },
  { name: 'checkbox', component: CheckboxField, field: { type: 'checkbox', name: 'f', label: 'Label' }, control: 'input', empty: false, value: true, set: true },
]

describe.each(cases)('$name field', ({ component, field, control, empty, value, set }) => {
  const render = (props: Record<string, unknown> = {}) =>
    mount(component, { props: { field, modelValue: empty, ...props }, attachTo: document.body })

  it('links the label to the control', () => {
    const wrapper = render()
    const id = wrapper.find(control).attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.find(`label[for="${id}"]`).text()).toBe('Label')
    wrapper.unmount()
  })

  it('sets the name attribute', () => {
    expect(render().find(control).attributes('name')).toBe('f')
  })

  it('emits update:modelValue', async () => {
    const wrapper = render()
    await wrapper.find(control).setValue(set)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([value])
  })

  it('marks required fields natively and visually', () => {
    const wrapper = render({ field: { ...field, required: true } })
    expect(wrapper.find(control).attributes('required')).toBeDefined()
    expect(wrapper.find('label span[aria-hidden="true"]').text()).toBe('*')
  })

  it('omits the required marker on optional fields', () => {
    const wrapper = render()
    expect(wrapper.find(control).attributes('required')).toBeUndefined()
    expect(wrapper.find('label span').exists()).toBe(false)
  })

  it('disables the control', () => {
    expect(render({ field: { ...field, disabled: true } }).find(control).attributes('disabled')).toBeDefined()
  })

  it('renders an accessible error', () => {
    const wrapper = render({ error: 'Oops' })
    const el = wrapper.find(control)
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(el.classes()).toContain('is-invalid')
    const errorId = el.attributes('aria-describedby')!
    expect(wrapper.find(`#${errorId}`).text()).toBe('Oops')
  })

  it('has no error attributes when valid', () => {
    const el = render().find(control)
    expect(el.attributes('aria-invalid')).toBeUndefined()
    expect(el.attributes('aria-describedby')).toBeUndefined()
  })

  it('emits blur', async () => {
    const wrapper = render()
    await wrapper.find(control).trigger('blur')
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  it('falls through attrs like class to the root', () => {
    const wrapper = mount(component, { props: { field }, attrs: { class: 'col-sm-4' } })
    expect(wrapper.classes()).toContain('col-sm-4')
  })

  it('generates unique ids within an app', () => {
    const wrapper = mount(() => [h(component, { field }), h(component, { field })])
    const [a, b] = wrapper.findAll(control).map(el => el.attributes('id'))
    expect(a).not.toBe(b)
  })
})

describe('TextField', () => {
  it('passes type, placeholder, inputmode and autocomplete', () => {
    const input = mount(TextField, {
      props: { field: { type: 'tel', name: 'p', label: 'P', placeholder: '06…', inputmode: 'numeric', autocomplete: 'tel' } },
    }).find('input')
    expect(input.attributes()).toMatchObject({ type: 'tel', placeholder: '06…', inputmode: 'numeric', autocomplete: 'tel' })
  })

  it('reflects modelValue', () => {
    const input = mount(TextField, { props: { field: { type: 'text', name: 'a', label: 'A' }, modelValue: 'hi' } }).find('input')
    expect(input.element.value).toBe('hi')
  })
})

describe('NumberField', () => {
  const field: FieldSchema = { type: 'number', name: 'n', label: 'N', min: 1, max: 9, step: 2 }

  it('passes bounds and step', () => {
    const input = mount(NumberField, { props: { field } }).find('input')
    expect(input.attributes()).toMatchObject({ type: 'number', min: '1', max: '9', step: '2' })
  })

  it('emits null when cleared', async () => {
    const wrapper = mount(NumberField, { props: { field, modelValue: 3 } })
    await wrapper.find('input').setValue('')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('renders null as empty', () => {
    expect(mount(NumberField, { props: { field, modelValue: null } }).find('input').element.value).toBe('')
  })
})

describe('SelectField', () => {
  const field: FieldSchema = { type: 'select', name: 's', label: 'S', options: [{ text: 'One', value: 1 }, { text: 'Two', value: 2 }] }

  it('shows the placeholder option when empty', () => {
    const wrapper = mount(SelectField, { props: { field }, attachTo: document.body })
    expect(wrapper.find('select').element.selectedIndex).toBe(0)
    expect(wrapper.find('option').text()).toBe('Choose...')
    wrapper.unmount()
  })

  it('uses the field placeholder', () => {
    expect(mount(SelectField, { props: { field: { ...field, placeholder: 'Pick' } } }).find('option').text()).toBe('Pick')
  })

  it('keeps numeric option values', async () => {
    const wrapper = mount(SelectField, { props: { field }, attachTo: document.body })
    await wrapper.find('select').setValue('2')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([2])
    wrapper.unmount()
  })
})
