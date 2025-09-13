<template>
  <template v-for="(row, index) in schema.rows" :key="index">
    <div class="form-row">
      <template v-for="field in row.fields" :key="field.name">
        <component :is="field.type" :field="field" v-model="data[field.name]"
          :class="`${field.size ? field.size : 'col-12'}`" @update:modelValue="onUpdate(field.name, $event)">
        </component>
      </template>
    </div>
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
  emits: ["updatedForm"],
  components: {
    textInput,
    emailInput,
    numberInput,
    dateInput,
    checkboxInput,
    selectInput
  },
  props: {
    schema: { required: true },
    data: { required: true }
  },
  methods: {
    onUpdate(fieldName, value) {
      this.data[fieldName] = value;
      this.$emit('updatedForm', { ...this.data });
    }
  }
}
</script>