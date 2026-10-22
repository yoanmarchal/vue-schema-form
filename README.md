# vite-form

Schema-driven, fully typed forms for Vue 3. Describe your fields once and get rendering, validation, dirty tracking and accessible markup, with value types inferred from the schema.

```vue
<script setup lang="ts">
import type { InferFormValues } from 'vite-form'
import { defineSchema, SchemaForm } from 'vite-form'

const schema = defineSchema({
  rows: [{
    fields: [
      { type: 'email', name: 'mail', label: 'Email', required: true, size: 'col-sm-6' },
      { type: 'select', name: 'civ', label: 'Title', options: [{ text: 'Mr', value: 'mr' }, { text: 'Ms', value: 'ms' }] },
      { type: 'checkbox', name: 'consent', label: 'I agree', required: true },
    ],
  }],
})

// { mail: string, civ: 'mr' | 'ms' | '', consent: boolean }
function save(values: InferFormValues<typeof schema>) { /* ... */ }
</script>

<template>
  <SchemaForm v-slot="{ form }" :schema="schema" @submit="save">
    <button :disabled="form.isSubmitting.value">
      Save
    </button>
  </SchemaForm>
</template>
```

Markup uses Bootstrap 5 classes (`row`, `form-label`, `form-control`, `form-select`, `form-switch`, …). Bring your own stylesheet, or swap the field components (see [Custom fields](#custom-fields)).

## Development

```bash
npm install
npm run dev          # playground on http://localhost:5173
npm test             # vitest in watch mode
npm run coverage     # tests + coverage thresholds
npm run typecheck    # vue-tsc, including type-level tests
npm run lint         # @antfu/eslint-config
npm run build        # library to dist/ (ESM + .d.ts)
```

## Schema

A schema is a list of rows, each holding fields. `defineSchema()` is an identity function that keeps literal types so values can be inferred.

| Field type | Value type | Extra options |
| --- | --- | --- |
| `text`, `email`, `tel`, `date` | `string` | `inputmode`, `autocomplete` |
| `number` | `number \| null` | `min`, `max`, `step` |
| `checkbox` | `boolean` | |
| `select` | union of option values, or `''` | `options: { text, value }[]` |

Every field accepts `name`, `label`, `placeholder`, `required`, `disabled`, `size` (column class, default `col-12`) and `validate(value, values)`, a custom rule that returns an error message to fail.

Use `InferFormValues<typeof schema>` to get the value type.

## `<SchemaForm>`

| Prop | Type | |
| --- | --- | --- |
| `schema` | `FormSchema` | required |
| `v-model` | `Partial<Values>` | initial values, kept in sync both ways |
| `messages` | `Partial<ValidationMessages>` | override error messages, supports `{label}`, `{min}`, `{max}` |
| `fields` | `FieldComponents` | per-instance field component overrides |

| Event | Payload |
| --- | --- |
| `submit` | values, only when valid |
| `invalid` | errors by field name |

Slots:

- `default`, `{ form }`: rendered after the fields, typically for buttons.
- `field:<name>`, `{ field, form }`: replaces the rendering of one field.

Errors appear once a field is blurred or after a submit attempt. A native `<button type="reset">` resets the form. The component exposes the `useForm` API through its template ref.

## Composables

### `useForm(schema, options?)`

The headless core used by `<SchemaForm>`. It works without any component.

```ts
const { values, errors, isValid, isDirty, touched, submitCount, isSubmitting, fields, setFieldValue, setTouched, reset, handleSubmit } = useForm(schema, {
  initialValues: { mail: 'me@example.com' }, // MaybeRefOrGetter
  messages: { required: '{label} is mandatory' }, // MaybeRefOrGetter
})

const onSubmit = handleSubmit(
  async values => api.save(values), // isSubmitting is true while this runs
  errors => console.warn(errors),
)
```

`schema` may be a ref or getter: fields added later get their default value. `reset(values?)` restores the initial values, or makes `values` the new baseline.

### `useField(name)`

Binds to a field of the nearest form provided by `<SchemaForm>` or by `provideForm(form)`.

```ts
const { value, error, touched, field, onBlur } = useField<string>('mail')
```

## Custom fields

A field component receives `field` and `error` props, supports `v-model`, and emits `blur`. Register it app-wide, or for a single form:

```ts
app.use(createSchemaForm({ fields: { rating: StarRating, text: MyTextInput } }))
```

```vue
<SchemaForm :schema="schema" :fields="{ rating: StarRating }" />
```

Built-in components (`TextField`, `NumberField`, `SelectField`, `CheckboxField`) are exported for standalone use.

## Utilities

`createDefaultValues(schema)`, `getFields(schema)`, `getDefaultValue(field)`, `validateField(field, value, values, messages?)`, `isEmpty(value)`, `defaultMessages`.

## Contributing

Pull requests run lint, typecheck, tests on Node 22 and 24 (plus Windows) with 100 % line coverage required, the library and playground builds, publint, `npm audit`, CodeQL and a dependency review. PR titles follow [Conventional Commits](https://www.conventionalcommits.org/).
