<template>
  <div>
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <select class="custom-select" v-model="data.value">
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
    data: { required: true }
  }
}
</script>