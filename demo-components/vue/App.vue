<template>
  <div
    class="turtle-panes__demo-wrapper"
    @dblclick="isDev && (isTesting = !isTesting)"
  >
    <UseItForImageComparison v-if="false" />
    <template v-else>
      <LettersDemo class="section-1 turtle-panes__demo-component" />
      <UseItForDashboards class="section-6 turtle-panes__demo-component" />
      <UseItForImageComparison class="section-7 turtle-panes__demo-component" />
      <PreventOverflow class="section-2 turtle-panes__demo-component" />
      <HideDemo class="section-4 turtle-panes__demo-component" />
      <FlexDemo class="section-3 turtle-panes__demo-component" />
      <CustomDividerDemo class="section-5 turtle-panes__demo-component" />
      <FrameworkSupport class="section-8 turtle-panes__demo-component" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LettersDemo from "./LettersDemo.vue";
import PreventOverflow from "./PreventOverflow.vue";
import FlexDemo from "./FlexDemo.vue";
import HideDemo from "./HideDemo.vue";
import UseItForDashboards from "./UseItForDashboards.vue";
import UseItForImageComparison from "./UseItForImageComparison.vue";
import CustomDividerDemo from "./CustomDividerDemo.vue";
import FrameworkSupport from "./FrameworkSupport.vue";
import useTracking from "../useTracking";

const isTesting = ref(false);
const isDev = import.meta.env.DEV;

useTracking();
</script>
<style lang="scss" src="../styles/App.scss"></style>
