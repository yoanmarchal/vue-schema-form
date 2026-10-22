import type { FormSchema } from '../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createSchemaForm } from '../registry'
import { defineSchema } from '../utils/schema'
import SchemaForm from './SchemaForm.vue'

const schema = defineSchema({
  rows: [
    {
      fields: [
        { type: 'text', name: 'lastname', label: 'Nom', size: 'col-sm-6' },
        { type: 'email', name: 'mail', label: 'Email', required: true },
      ],
    },
    {
      fields: [
        { type: 'number', name: 'age', label: 'Âge' },
        { type: 'date', name: 'bd', label: 'Naissance' },
        { type: 'checkbox', name: 'nl', label: 'Newsletter' },
        { type: 'select', name: 'civ', label: 'Civ', options: [{ text: 'M.', value: 'M' }] },
      ],
    },
  ],
})

const blank = { lastname: '', mail: '', age: null, bd: '', nl: false, civ: '' }

function render(props: Record<string, unknown> = {}, options: Parameters<typeof mount>[1] = {}) {
  return mount(SchemaForm, { props: { schema, ...props }, attachTo: document.body, ...options } as any)
}

describe('SchemaForm', () => {
  it('renders a form with one row per schema row', () => {
    const wrapper = render()
    expect(wrapper.element.tagName).toBe('FORM')
    expect(wrapper.findAll('.row')).toHaveLength(2)
  })

  it('renders every field type', () => {
    const wrapper = render()
    for (const selector of ['input[type=text]', 'input[type=email]', 'input[type=number]', 'input[type=date]', 'input[type=checkbox]', 'select'])
      expect(wrapper.find(selector).exists(), selector).toBe(true)
    expect(wrapper.findAll('label')).toHaveLength(6)
  })

  it('applies field.size, defaulting to col-12', () => {
    const cols = render().findAll('.row > div')
    expect(cols[0]!.classes()).toContain('col-sm-6')
    expect(cols[1]!.classes()).toContain('col-12')
  })

  it('emits update:modelValue with the full state', async () => {
    const wrapper = render()
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    await wrapper.find('input[type=checkbox]').setValue(true)
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([{ ...blank, mail: 'a@b.fr', nl: true }])
  })

  it('does not mutate the bound object', async () => {
    const data = { ...blank }
    const wrapper = render({ modelValue: data })
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    expect(data.mail).toBe('')
  })

  it('uses modelValue as initial values and follows external changes', async () => {
    const wrapper = render({ modelValue: { mail: 'init@b.fr' } })
    expect((wrapper.find('input[type=email]').element as HTMLInputElement).value).toBe('init@b.fr')
    await wrapper.setProps({ modelValue: { ...blank, mail: 'next@b.fr' } })
    expect((wrapper.find('input[type=email]').element as HTMLInputElement).value).toBe('next@b.fr')
  })

  it('emits submit with values when valid', async () => {
    const wrapper = render({ modelValue: { mail: 'a@b.fr' } })
    await wrapper.trigger('submit')
    await nextTick()
    expect(wrapper.emitted('submit')![0]).toEqual([{ ...blank, mail: 'a@b.fr' }])
    expect(wrapper.emitted('invalid')).toBeUndefined()
  })

  it('emits invalid and reveals errors when invalid', async () => {
    const wrapper = render()
    expect(wrapper.find('.invalid-feedback').exists()).toBe(false)
    await wrapper.trigger('submit')
    await nextTick()
    expect(wrapper.emitted('invalid')![0]).toEqual([{ mail: 'Email is required' }])
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('.invalid-feedback').text()).toBe('Email is required')
  })

  it('reveals a field error on blur', async () => {
    const wrapper = render()
    await wrapper.find('input[type=email]').trigger('blur')
    expect(wrapper.find('.invalid-feedback').text()).toBe('Email is required')
  })

  it('uses custom messages', async () => {
    const wrapper = render({ messages: { required: '{label} obligatoire' } })
    await wrapper.trigger('submit')
    await nextTick()
    expect(wrapper.find('.invalid-feedback').text()).toBe('Email obligatoire')
  })

  it('resets on native reset', async () => {
    const wrapper = render()
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    await wrapper.trigger('reset')
    expect((wrapper.find('input[type=email]').element as HTMLInputElement).value).toBe('')
  })

  it('exposes the form API', async () => {
    const wrapper = render()
    const form = wrapper.vm as any
    form.setFieldValue('mail', 'x@y.z')
    await nextTick()
    expect((wrapper.find('input[type=email]').element as HTMLInputElement).value).toBe('x@y.z')
    expect(form.isDirty).toBe(true)
  })

  it('passes the form to the default slot', async () => {
    const wrapper = render({}, {
      slots: { default: ({ form }: any) => h('button', { disabled: !form.isDirty.value }, 'Save') },
    })
    expect(wrapper.find('form > button').attributes('disabled')).toBeDefined()
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    expect(wrapper.find('form > button').attributes('disabled')).toBeUndefined()
  })

  it('lets a named slot replace one field', () => {
    const wrapper = render({}, {
      slots: { 'field:mail': ({ field }: any) => h('p', { class: 'custom' }, field.label) },
    })
    expect(wrapper.find('p.custom').text()).toBe('Email')
    expect(wrapper.find('input[type=email]').exists()).toBe(false)
  })

  it('renders custom field components from the plugin or props', async () => {
    const Rating = defineComponent({
      props: { field: Object, modelValue: null },
      emits: ['update:modelValue'],
      setup: (props, { emit }) => () => h('button', { class: 'rating', onClick: () => emit('update:modelValue', 5) }, String(props.modelValue)),
    })
    const custom = { rows: [{ fields: [{ type: 'text', name: 'stars', label: 'Stars' }] }] } satisfies FormSchema

    const viaPlugin = render({ schema: custom }, { global: { plugins: [createSchemaForm({ fields: { text: Rating } })] } })
    await viaPlugin.find('.rating').trigger('click')
    expect(viaPlugin.emitted('update:modelValue')!.at(-1)).toEqual([{ stars: 5 }])

    const viaProp = render({ schema: custom, fields: { text: Rating } })
    expect(viaProp.find('.rating').exists()).toBe(true)
  })

  it('warns and skips unknown field types', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = render({ schema: { rows: [{ fields: [{ type: 'nope', name: 'x', label: 'X' }] }] } })
    expect(wrapper.find('label').exists()).toBe(false)
    expect(warn.mock.calls.some(([msg]) => String(msg).includes('No component registered for field type "nope"'))).toBe(true)
    warn.mockRestore()
  })
})
