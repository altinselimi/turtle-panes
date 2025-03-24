<template>
  <Section
    contentStyle="align-items: flex-start;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Or maybe hide it ?</h1>
      <p class="turtle-panes__description">
        Once a pane reaches its min-width,<br>you can also choose to hide it
      </p>
      <div class="demo-intro__source-code">
          <a :href="examplesUrl.react"><ReactIcon /> </a>
          <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <TurtlePanes
      ref="turtlePanesRef"
      style="margin: 40px 0px; border-radius: 20px"
    >
      <TurtlePane :min-width="120" :hide-on-min-width-exceeded="true">
        <div class="turtle-panes__demo-box">
          <p>If you don’t want me I’ll just leave</p>
        </div>
      </TurtlePane>
      <TurtlePane :min-width="100" style="align-self: stretch">
        <div class="turtle-panes__demo-box">
          <p>My min width is very important to me</p>
        </div>
      </TurtlePane>
    </TurtlePanes>
    <button
        @click="turtlePanesRef?.reShowPane(1)"
        :style="{ opacity: showResetPaneButton ? 1 : 0 }"
        class="demo-intro__button"
      >
        Reset
      </button>
  </Section>
</template>
<script setup lang="ts">
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import Section from "./Section.vue";
import { ref, computed } from "vue";
import type { ExposedFunctions } from "../../packages/core/src/types";
import { ReactIcon, VueDotjsIcon as VueIcon } from "vue3-simple-icons";

const turtlePanesRef = ref<ExposedFunctions | null>(null);

const showResetPaneButton = computed(() => {
  return !!turtlePanesRef.value?.hiddenPanes().length;
});

const examplesUrl = {
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/HideDemo.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/HideDemo.vue`,
}
</script>
