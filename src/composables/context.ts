import type { InjectionKey } from 'vue'
import type { UseFormReturn } from './useForm'
import { inject, provide } from 'vue'

export const FormContextKey: InjectionKey<UseFormReturn> = Symbol('vite-form:form')

/** Exposes a form to descendant `useField()` calls. */
export function provideForm(form: UseFormReturn<any>): void {
  provide(FormContextKey, form)
}

export function injectForm(): UseFormReturn {
  const form = inject(FormContextKey, null)
  if (!form)
    throw new Error('[vite-form] useField() must be used inside <SchemaForm> or after provideForm().')
  return form
}
