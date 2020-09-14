<template>
  <div>
    <b-form-checkbox v-model="data.value" switch class="right ">
      {{ field.label }}
    </b-form-checkbox>
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