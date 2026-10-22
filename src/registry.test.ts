import type { ComputedRef } from 'vue'
import type { FieldComponents } from './registry'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import CheckboxField from './components/fields/CheckboxField.vue'
import TextField from './components/fields/TextField.vue'
import { createSchemaForm, defaultFieldComponents, useFieldComponents } from './registry'

const Custom = defineComponent({ render: () => null })

function resolve(plugins: ReturnType<typeof createSchemaForm>[] = [], overrides?: FieldComponents) {
  let components!: ComputedRef<FieldComponents>
  mount(defineComponent({
    setup() {
      components = useFieldComponents(() => overrides)
      return () => null
    },
  }), { global: { plugins } })
  return components.value
}

describe('field registry', () => {
  it('maps every built-in type', () => {
    expect(Object.keys(defaultFieldComponents).sort()).toEqual(
      ['checkbox', 'date', 'email', 'number', 'select', 'tel', 'text'],
    )
    expect(defaultFieldComponents.email).toBe(TextField)
  })

  it('falls back to built-ins without the plugin', () => {
    expect(resolve().checkbox).toBe(CheckboxField)
  })

  it('lets the plugin override and add types', () => {
    const components = resolve([createSchemaForm({ fields: { text: Custom, rating: Custom } })])
    expect(components.text).toBe(Custom)
    expect(components.rating).toBe(Custom)
    expect(components.checkbox).toBe(CheckboxField)
  })

  it('installs with no options', () => {
    expect(resolve([createSchemaForm()]).text).toBe(TextField)
  })

  it('gives local overrides the last word', () => {
    const Local = defineComponent({ render: () => null })
    const components = resolve([createSchemaForm({ fields: { text: Custom } })], { text: Local })
    expect(components.text).toBe(Local)
  })
})
