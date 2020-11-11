<template>
  <div class="col">
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <input class="input form-control" type="date" :placeholder="field.placeholder" v-model="data.value"  v-on:input="$emit('input', {model: field.name, value: $event.target.value})">
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