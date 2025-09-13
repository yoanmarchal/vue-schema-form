<template>
  <div class="col">
    <div class="custom-control custom-switch ml-2">
      <input type="checkbox" class="custom-control-input" :id="field.label" :checked="modelValue" autocomplete="off"
        @change="$emit('update:modelValue', $event.target.checked)">
      <label class="custom-control-label" :for='field.label'>
        {{ field.label }}
        <span v-if="field.required">*</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    field: { required: true },
    modelValue: Boolean
  }
}
</script>