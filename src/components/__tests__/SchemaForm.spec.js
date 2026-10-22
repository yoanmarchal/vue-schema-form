import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SchemaForm from '../SchemaForm.vue'

const schema = {
  rows: [
    {
      fields: [
        { type: 'text-input', name: 'lastname', label: 'Nom', size: 'col-sm-6' },
        { type: 'email-input', name: 'mail', label: 'Email' },
      ],
    },
    {
      fields: [
        { type: 'number-input', name: 'cp', label: 'CP' },
        { type: 'date-input', name: 'bd', label: 'Naissance' },
        { type: 'checkbox-input', name: 'nl', label: 'Newsletter' },
        { type: 'select-input', name: 'civ', label: 'Civ', options: [{ text: 'M.', value: 'M' }] },
      ],
    },
  ],
}

const blank = () => ({ lastname: '', mail: '', cp: '', bd: '', nl: false, civ: '' })

describe('SchemaForm', () => {
  it('renders one .form-row per schema row', () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    expect(wrapper.findAll('.form-row')).toHaveLength(2)
  })

  it('renders every field type', () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    expect(wrapper.find('input[type=text]').exists()).toBe(true)
    expect(wrapper.find('input[type=email]').exists()).toBe(true)
    expect(wrapper.find('input[type=date]').exists()).toBe(true)
    expect(wrapper.find('input[type=checkbox]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.findAll('label')).toHaveLength(6)
  })

  it('emits updatedForm with a snapshot of all values', async () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    await wrapper.find('input[type=checkbox]').setValue(true)
    const events = wrapper.emitted('updatedForm')
    expect(events.at(-1)[0]).toEqual({ ...blank(), mail: 'a@b.fr', nl: true })
  })

  it('emits a copy, not the internal object', async () => {
    const data = blank()
    const wrapper = mount(SchemaForm, { props: { schema, data } })
    await wrapper.find('input[type=email]').setValue('x@y.z')
    expect(wrapper.emitted('updatedForm').at(-1)[0]).not.toBe(data)
  })

  it('does not mutate the data prop', async () => {
    const data = blank()
    const wrapper = mount(SchemaForm, { props: { schema, data } })
    await wrapper.find('input[type=email]').setValue('x@y.z')
    expect(data.mail).toBe('')
  })

  it('emits updatedForm once per change', async () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    expect(wrapper.emitted('updatedForm')).toHaveLength(1)
  })

  it('applies field.size, defaulting to col-12', () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    const cols = wrapper.findAll('.form-row > div')
    expect(cols[0].classes()).toContain('col-sm-6')
    expect(cols[1].classes()).toContain('col-12')
  })

  it('renders a <form> and emits submit', async () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('emits submit with current values', async () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')[0][0]).toEqual({ ...blank(), mail: 'a@b.fr' })
  })

  it('syncs when the data prop changes', async () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() } })
    await wrapper.setProps({ data: { ...blank(), mail: 'new@b.fr' } })
    expect(wrapper.find('input[type=email]').element.value).toBe('new@b.fr')
  })

  it('renders the default slot inside the form', () => {
    const wrapper = mount(SchemaForm, { props: { schema, data: blank() }, slots: { default: '<button>OK</button>' } })
    expect(wrapper.find('form button').text()).toBe('OK')
  })
})
