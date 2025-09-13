<template>
  <div class="col">
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <input class="input form-control" type="text" :placeholder="field.placeholder" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script>
export default {
  name: 'textInput',
  inheritAttrs: false,
  props: {
    field: { required: true },
    modelValue: String
  }
}
</script>