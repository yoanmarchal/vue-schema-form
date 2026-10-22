import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders the registration form with all 11 fields', () => {
    const wrapper = mount(App)
    expect(wrapper.findAll('label')).toHaveLength(11)
  })

  it('initialises checkboxes to false and other fields to empty', () => {
    const wrapper = mount(App)
    const data = wrapper.vm.UserRegisterData
    expect(data.nl).toBe(false)
    expect(data.consent).toBe(false)
    expect(data.lastname).toBe('')
    expect(data.cp).toBe('')
  })

  it('displays form data after an update', async () => {
    const wrapper = mount(App)
    await wrapper.find('input[type=email]').setValue('a@b.fr')
    expect(wrapper.find('pre').text()).toContain('"mail": "a@b.fr"')
  })
})
