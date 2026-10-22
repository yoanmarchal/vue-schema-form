import type { InferFormValues, ValidationMessages } from 'vite-form'
import { defineSchema } from 'vite-form'

export const userRegisterSchema = defineSchema({
  rows: [
    {
      fields: [
        {
          type: 'select',
          name: 'civ',
          label: 'Civilité',
          options: [
            { text: 'Mme', value: 'Madame' },
            { text: 'M.', value: 'Monsieur' },
          ],
          required: true,
          size: 'col-sm-2',
        },
        { type: 'text', name: 'lastname', label: 'Nom', autocomplete: 'family-name', size: 'col-sm-5' },
        { type: 'text', name: 'firstname', label: 'Prénom', autocomplete: 'given-name', size: 'col-sm-5' },
      ],
    },
    {
      fields: [
        { type: 'date', name: 'bd', label: 'Date de naissance', size: 'col-sm-6' },
        { type: 'email', name: 'mail', label: 'Email', required: true, autocomplete: 'email', size: 'col-sm-6' },
        { type: 'text', name: 'address', label: 'Adresse', required: true, autocomplete: 'street-address', size: 'col-sm-8' },
        {
          type: 'text',
          name: 'cp',
          label: 'Code postal',
          required: true,
          inputmode: 'numeric',
          autocomplete: 'postal-code',
          size: 'col-sm-4',
          validate: (value: string) => /^\d{5}$/.test(value) ? undefined : 'Le code postal doit contenir 5 chiffres',
        },
        { type: 'text', name: 'city', label: 'Ville', required: true, autocomplete: 'address-level2', size: 'col-sm-6' },
        { type: 'tel', name: 'phone', label: 'Téléphone', autocomplete: 'tel', size: 'col-sm-6' },
        { type: 'checkbox', name: 'nl', label: 'Newsletter' },
        { type: 'checkbox', name: 'consent', label: 'Consentement', required: true },
      ],
    },
  ],
})

export type UserRegister = InferFormValues<typeof userRegisterSchema>

export const messagesFr: ValidationMessages = {
  required: '{label} est obligatoire',
  email: '{label} doit être une adresse valide',
  min: '{label} doit être supérieur ou égal à {min}',
  max: '{label} doit être inférieur ou égal à {max}',
}
