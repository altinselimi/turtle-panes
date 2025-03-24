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
import { ref, onMounted, onBeforeUnmount } from "vue";
import LettersDemo from "./LettersDemo.vue";
import PreventOverflow from "./PreventOverflow.vue";
import FlexDemo from "./FlexDemo.vue";
import HideDemo from "./HideDemo.vue";
import UseItForDashboards from "./UseItForDashboards.vue";
import UseItForImageComparison from "./UseItForImageComparison.vue";
import CustomDividerDemo from "./CustomDividerDemo.vue";
import RawDashboard from "./RawDashboard.vue";
import FrameworkSupport from "./FrameworkSupport.vue";
import useTracking from "../useTracking";

const isTesting = ref(false);
const isDev = import.meta.env.DEV;

const tracking = useTracking();

onMounted(() => {
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://cloud.umami.is/script.js";
  script.dataset.websiteId = "19647df5-af82-427b-976f-a2e6f1246a57";
  script.onload = () => {
    if ("onMountCallback" in tracking && tracking.onMountCallback) {
      tracking.onMountCallback();
    }
  };
  document.body.appendChild(script);
});

onBeforeUnmount(() => {
  if ("onUnmountCallback" in tracking && tracking.onUnmountCallback) {
    tracking.onUnmountCallback();
  }
});
</script>
<style lang="scss" src="../styles/App.scss"></style>
