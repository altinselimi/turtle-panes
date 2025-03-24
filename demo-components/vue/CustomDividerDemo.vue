<template>
  <Section
    contentStyle="align-items: flex-start;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Custom divider ?</h1>
      <p class="turtle-panes__description">We got you covered.</p>
      <div class="demo-intro__source-code">
          <a :href="examplesUrl.react"><ReactIcon /> </a>
          <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <TurtlePanes
      style="
        margin: 20px 0px;
        border-radius: 20px;
        background-color: var(--white);
      "
    >
      <TurtlePane>
        <div style="width: 30cqw" class="turtle-panes__demo-box"></div>
        <template v-slot:divider>
          <div class="turtle-panes__custom-divider">🐢</div>
        </template>
      </TurtlePane>
      <TurtlePane>
        <div style="width: 30cqw" class="turtle-panes__demo-box"></div>
        <template v-slot:divider>
          <div class="turtle-panes__custom-divider">🏎️</div>
        </template>
      </TurtlePane>
      <TurtlePane>
        <div style="width: 30cqw" class="turtle-panes__demo-box"></div>
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
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/CustomDividerDemo.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/CustomDividerDemo.vue`,
}
</script>
<style lang="scss" src="../styles/CustomDividerDemo.scss">
</style>
