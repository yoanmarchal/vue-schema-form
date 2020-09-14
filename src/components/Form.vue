<template>
  <template v-for="(row, index) in schema.rows" :key="index">
    <div class="form-row">
      <template v-for="field in row.fields" :key="field.name">
        <component :is="field.type" :field="field" :data="data[field.name]" v-on:input="data[field.name] = $event" class="form-group" :class="`${field.size ? field.size : 'col-12'}`"></component>
      </template>
    </div>
  </template> 
  <template v-for="field in schema.fields" :key="field.name">
    <component :is="field.type" :field="field" :data="data[field.name]" class="form-group"></component>
  </template>
</template>

<script>
import textInput from './TextInput.vue'
import emailInput from './EmailInput.vue'
import numberInput from './NumberInput.vue'
import dateInput from './DateInput.vue'
import checkboxInput from './CheckboxInput.vue'
import selectInput from './SelectInput.vue'

export default {
  components: {
    textInput,
    emailInput,
    numberInput,
    dateInput,
    checkboxInput,
    selectInput,
  },
  props: {
    schema: { required: true },
    data: { required: true }
  }
}
</script>