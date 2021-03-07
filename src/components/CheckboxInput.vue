<template>
  <div class="col">
    <div class="custom-control custom-switch ml-2">
      <input type="checkbox" class="custom-control-input" :id="field.label"  v-model="data.value" autocomplete="off">
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
    data: { required: true }
  }
}
</script>