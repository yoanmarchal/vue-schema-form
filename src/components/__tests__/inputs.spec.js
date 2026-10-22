import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from '../TextInput.vue'
import EmailInput from '../EmailInput.vue'
import NumberInput from '../NumberInput.vue'
import DateInput from '../DateInput.vue'
import CheckboxInput from '../CheckboxInput.vue'
import SelectInput from '../SelectInput.vue'

const textLike = [
  { name: 'TextInput', component: TextInput, type: 'text', value: 'Marchal' },
  { name: 'EmailInput', component: EmailInput, type: 'email', value: 'a@b.fr' },
  { name: 'NumberInput', component: NumberInput, type: 'text', value: '75001' },
  { name: 'DateInput', component: DateInput, type: 'date', value: '2020-01-31' }
]

describe.each(textLike)('$name', ({ component, type, value }) => {
  const field = { name: 'f', label: 'Libellé', placeholder: 'ph' }

  it('renders label, placeholder and input type', () => {
    const wrapper = mount(component, { props: { field, modelValue: '' } })
    expect(wrapper.find('label').text()).toBe('Libellé')
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe(type)
    expect(input.attributes('placeholder')).toBe('ph')
  })

  it('reflects modelValue', () => {
    const wrapper = mount(component, { props: { field, modelValue: value } })
    expect(wrapper.find('input').element.value).toBe(value)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(component, { props: { field, modelValue: '' } })
    await wrapper.find('input').setValue(value)
    expect(wrapper.emitted('update:modelValue')).toEqual([[value]])
  })

  it('shows a required marker', () => {
    const wrapper = mount(component, { props: { field: { ...field, required: true }, modelValue: '' } })
    expect(wrapper.find('label span').text()).toBe('*')
  })

  it('hides the required marker when optional', () => {
    const wrapper = mount(component, { props: { field, modelValue: '' } })
    expect(wrapper.find('label span').exists()).toBe(false)
  })

  // DEBT: <label> is not bound to its <input> (no id / for)
  it.fails('associates the label with the input', () => {
    const wrapper = mount(component, { props: { field, modelValue: '' }, attachTo: document.body })
    const id = wrapper.find('input').attributes('id')
    expect(id).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(id)
    wrapper.unmount()
  })

  // DEBT: field.required is only cosmetic
  it.fails('sets the native required attribute', () => {
    const wrapper = mount(component, { props: { field: { ...field, required: true }, modelValue: '' } })
    expect(wrapper.find('input').attributes('required')).toBeDefined()
  })

  // DEBT: inheritAttrs: false drops the size class passed by Form
  it.fails('applies class passed from the parent', () => {
    const wrapper = mount(component, { props: { field, modelValue: '' }, attrs: { class: 'col-sm-4' } })
    expect(wrapper.classes()).toContain('col-sm-4')
  })
})

describe('NumberInput', () => {
  // DEBT: rendered as type="text", no numeric keyboard
  it.fails('uses a numeric input mode', () => {
    const wrapper = mount(NumberInput, { props: { field: { name: 'cp', label: 'CP' }, modelValue: '' } })
    expect(wrapper.find('input').attributes('inputmode')).toBe('numeric')
  })
})

describe('CheckboxInput', () => {
  const field = { name: 'nl', label: 'Newsletter' }

  it('reflects modelValue', () => {
    const wrapper = mount(CheckboxInput, { props: { field, modelValue: true } })
    expect(wrapper.find('input').element.checked).toBe(true)
  })

  it('emits a boolean on change', async () => {
    const wrapper = mount(CheckboxInput, { props: { field, modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })

  it('binds label to input', () => {
    const wrapper = mount(CheckboxInput, { props: { field, modelValue: false } })
    expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('input').attributes('id'))
  })

  // DEBT: id is derived from the label (spaces, accents, collisions)
  it.fails('produces a valid, unique id even with spaces in the label', () => {
    const a = mount(CheckboxInput, { props: { field: { name: 'a', label: 'Mon label' }, modelValue: false } })
    const b = mount(CheckboxInput, { props: { field: { name: 'b', label: 'Mon label' }, modelValue: false } })
    const idA = a.find('input').attributes('id')
    expect(idA).not.toMatch(/\s/)
    expect(idA).not.toBe(b.find('input').attributes('id'))
  })
})

describe('SelectInput', () => {
  const field = {
    name: 'civ',
    label: 'Civilité',
    options: [
      { text: 'Mme', value: 'Madame' },
      { text: 'M.', value: 'Monsieur' }
    ]
  }

  it('renders options plus a placeholder', () => {
    const wrapper = mount(SelectInput, { props: { field, modelValue: '' } })
    const options = wrapper.findAll('option')
    expect(options.map(o => o.text())).toEqual(['Choose...', 'Mme', 'M.'])
  })

  it('reflects modelValue', () => {
    const wrapper = mount(SelectInput, { props: { field, modelValue: 'Monsieur' } })
    expect(wrapper.find('select').element.value).toBe('Monsieur')
  })

  it('emits update:modelValue on selection', async () => {
    const wrapper = mount(SelectInput, { props: { field, modelValue: '' } })
    await wrapper.find('select').setValue('Madame')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['Madame'])
  })

  // DEBT: placeholder option has value "default" so an empty model selects nothing
  it.fails('shows the placeholder when the model is empty', () => {
    const wrapper = mount(SelectInput, { props: { field, modelValue: '' }, attachTo: document.body })
    expect(wrapper.find('select').element.selectedIndex).toBe(0)
    wrapper.unmount()
  })
})
