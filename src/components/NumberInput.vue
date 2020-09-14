<template>
    <div>
      <label>
        {{ field.label }}
        <span v-if="field.required">*</span>
      </label>
      <input class="input form-control" type="text" :placeholder="field.placeholder" v-model="data.value">
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