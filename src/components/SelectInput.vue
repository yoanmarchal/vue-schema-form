<template>
  <div class="col">
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <select class="custom-select" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
      <option value="default" disabled hidden>Choose...</option>
      <option v-for="option in field.options" :value="option.value" :key="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    field: { required: true },
    modelValue: [String, Number]
  }
}
</script>