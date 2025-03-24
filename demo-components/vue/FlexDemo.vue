<template>
  <Section
    contentStyle="align-items: stretch;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Give it all the space</h1>
      <p class="turtle-panes__description" style="max-width: 35ch;">
        You can let a pane breathe as much as it
        wants with flex=’true’
      </p>
      <div class="demo-intro__source-code">
          <a :href="examplesUrl.react"><ReactIcon /> </a>
          <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <TurtlePanes style="margin: 40px 0px; border-radius: 20px">
      <TurtlePane :is-flex="true">
        <div class="turtle-panes__demo-box">
          <p>I'll eat all I can</p>
        </div>
      </TurtlePane>
      <TurtlePane>
        <div class="turtle-panes__demo-box">
          <p>
            I'll take <br />
            what I need
          </p>
        </div>
      </TurtlePane>
    </TurtlePanes>
  </Section>
</template>
<script setup lang="ts">
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import { ReactIcon, VueDotjsIcon as VueIcon } from "vue3-simple-icons";
import Section from "./Section.vue";
const examplesUrl = {
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/FlexDemo.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/FlexDemo.vue`,
}
</script>
