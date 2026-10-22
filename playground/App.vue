<script setup lang="ts">
import type { UserRegister } from './schema'
import { SchemaForm } from 'vite-form'
import { ref } from 'vue'
import { messagesFr, userRegisterSchema } from './schema'

const values = ref<Partial<UserRegister>>({})
const submitted = ref<UserRegister>()
</script>

<template>
  <div class="container">
    <SchemaForm
      v-slot="{ form }"
      v-model="values"
      :schema="userRegisterSchema"
      :messages="messagesFr"
      @submit="submitted = $event"
    >
      <div class="mt-3">
        <button type="submit" class="btn btn-primary" :disabled="form.isSubmitting.value">
          Envoyer
        </button>
        <button type="reset" class="btn btn-link" :disabled="!form.isDirty.value">
          Réinitialiser
        </button>
      </div>
    </SchemaForm>

    <pre data-test="values">{{ values }}</pre>
    <pre v-if="submitted" data-test="submitted">{{ submitted }}</pre>
  </div>
</template>
