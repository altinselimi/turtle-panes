<template>
  <div class="turtle-panes__checkbox">
    <input
      type="checkbox"
      :checked="modelValue"
      @click="
        emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      "
    />
    <CheckCircle2 />
    <span>
      <slot></slot>
    </span>
  </div>
</template>
<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";
const { modelValue } = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
</script>
<style lang="scss" src="../styles/Checkbox.scss">
</style>
