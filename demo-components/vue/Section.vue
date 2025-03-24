<template>
  <div class="demo-section">
    <div class="demo-section__container" :style="{ maxWidth: props.maxWidth }">
      <div class="demo-section__content" :style="contentStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    maxWidth?: string;
    contentStyle?: string;
  }>(),
  {
    maxWidth: "clamp(100px, 90cqw, 650px)",
  },
);
</script>
<style lang="scss" src="../styles/Section.scss">

</style>
