<template>
    <div>
      <label>
        {{ field.label }}
        <span v-if="field.required">*</span>
      </label>
      <input class="input form-control" type="text" :placeholder="field.placeholder" v-model="value" v-on:input="$emit('input', $event.target.value)" >
    </div>
</template>

<script>
export default {
  name: 'textInputTest',
  inheritAttrs: false,
  props: {
    field: { required: true },
    value: { required: true }
  }
}
</script>