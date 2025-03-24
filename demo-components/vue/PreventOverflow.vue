<template>
  <Section
    contentStyle="align-items: flex-start;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Let the content decide</h1>
      <p class="turtle-panes__description">
        There is a prevent-overflow behavior you can use to make sure pane
        content is always visible.
      </p>
      <div class="demo-intro__source-code">
        <a :href="examplesUrl.react"><ReactIcon /> </a>
        <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <TurtlePanes style="margin: 40px 0px; border-radius: 20px">
      <TurtlePane :prevent-content-overflow="true">
        <div class="turtle-panes__demo-box">
          <p style="min-width: 150px">I will always be visible</p>
        </div>
      </TurtlePane>
      <TurtlePane>
        <div class="turtle-panes__demo-box">
          <p style="min-width: 150px">I might be clipped at certain widths</p>
        </div>
      </TurtlePane>
    </TurtlePanes>
  </Section>
</template>
<script setup lang="ts">
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import Section from "./Section.vue";
import { ReactIcon, VueDotjsIcon as VueIcon } from "vue3-simple-icons";

const examplesUrl = {
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/PreventOverflow.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/PreventOverflow.vue`,
};
</script>
