<template>
  <Section
    contentStyle="align-items: center;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Framework support</h1>
      <p class="turtle-panes__description">
        Turtle-Panes plays nicely with some of the major frameworks
      </p>
    </div>
    <div class="demo-framework-support__icons">
      <a class="demo-intro__button" href="/vue/getting-started">
        <VueDotjsIcon />
        <span>Vue Docs</span>
      </a>
      <a class="demo-intro__button" href="/react/getting-started">
        <ReactIcon />
        <span>React Docs</span>
      </a>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { ReactIcon, VueDotjsIcon } from "vue3-simple-icons";
import Section from "./Section.vue";
</script>
<style lang="scss" src="../styles/FrameworkSupport.scss"></style>