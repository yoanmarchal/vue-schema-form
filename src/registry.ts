import type { Component, InjectionKey, MaybeRefOrGetter, Plugin } from 'vue'
import type { FieldType } from './types'
import { computed, inject, toValue } from 'vue'
import CheckboxField from './components/fields/CheckboxField.vue'
import NumberField from './components/fields/NumberField.vue'
import SelectField from './components/fields/SelectField.vue'
import TextField from './components/fields/TextField.vue'

/**
 * A field component receives `field` and `error` props, supports `v-model`
 * and emits `blur` when it loses focus.
 */
export type FieldComponents = Partial<Record<FieldType, Component>> & Record<string, Component>

export const defaultFieldComponents: Record<FieldType, Component> = {
  text: TextField,
  email: TextField,
  tel: TextField,
  date: TextField,
  number: NumberField,
  checkbox: CheckboxField,
  select: SelectField,
}

export const FieldRegistryKey: InjectionKey<FieldComponents> = Symbol('vite-form:fields')

export interface SchemaFormPluginOptions {
  /** Replace built-in field components or register new field types app-wide. */
  fields?: FieldComponents
}

export function createSchemaForm(options: SchemaFormPluginOptions = {}): Plugin {
  return {
    install(app) {
      app.provide(FieldRegistryKey, { ...defaultFieldComponents, ...options.fields })
    },
  }
}

/** Resolves field components: local overrides, then the app plugin, then built-ins. */
export function useFieldComponents(overrides?: MaybeRefOrGetter<FieldComponents | undefined>) {
  const registry = inject(FieldRegistryKey, defaultFieldComponents)
  return computed<FieldComponents>(() => ({ ...registry, ...toValue(overrides) }))
}
