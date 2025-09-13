<template>
  <div class="col">
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <input class="input form-control" type="email" :placeholder="field.placeholder" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    field: { required: true },
    modelValue: String
  }
}
</script>