import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import App from './App.vue'

describe('playground', () => {
  it('renders the registration form', () => {
    const wrapper = mount(App, { attachTo: document.body })
    expect(wrapper.findAll('label')).toHaveLength(11)
  })

  it('mirrors values as they are typed', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    expect(wrapper.find('[data-test=values]').text()).toContain('"mail": "a@b.fr"')
  })

  it('shows French errors and validates the postal code', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    await wrapper.find('input[name=cp]').setValue('123')
    await wrapper.find('form').trigger('submit')
    await nextTick()
    const errors = wrapper.findAll('.invalid-feedback').map(e => e.text())
    expect(errors).toContain('Email est obligatoire')
    expect(errors).toContain('Le code postal doit contenir 5 chiffres')
    expect(wrapper.find('[data-test=submitted]').exists()).toBe(false)
  })

  it('submits a complete form', async () => {
    const wrapper = mount(App, { attachTo: document.body })
    await wrapper.find('select[name=civ]').setValue('Madame')
    await wrapper.find('input[name=mail]').setValue('a@b.fr')
    await wrapper.find('input[name=address]').setValue('1 rue de Paris')
    await wrapper.find('input[name=cp]').setValue('75001')
    await wrapper.find('input[name=city]').setValue('Paris')
    await wrapper.find('input[name=consent]').setValue(true)
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.find('[data-test=submitted]').text()).toContain('"cp": "75001"')
  })
})
