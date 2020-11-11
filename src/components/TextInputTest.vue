<template>
  <div class="col">
    <label>
      {{ field.label }}
      <span v-if="field.required">*</span>
    </label>
    <input class="input form-control" type="text" :placeholder="field.placeholder" v-model="data" v-on:input="$emit('input', $event.target.data)" >
  </div>
</template>

<script>
export default {
  name: 'textInputTest',
  inheritAttrs: false,
  props: {
    field: { required: true },
    data: { required: true }
  }
}
</script>