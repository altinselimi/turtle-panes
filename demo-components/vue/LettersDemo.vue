<template>
  <Section
    contentStyle="align-items: center;"
  >
    <div class="demo-intro__logo" alt="logo with text TURTLE PANES">
      <div class="demo-intro__github-star">
        <iframe src="https://ghbtns.com/github-btn.html?user=altinselimi&repo=turtle-panes&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
      </div>
      <TurtlePanes style="width: 100%; justify-content: center;">
        <TurtlePane
          v-for="letter in 'TURTLE'.split('')"
          :min-width="20"
        >
          <div class="demo-intro__logo-letter">
            {{ letter }}
          </div>
          <template v-slot:divider>
            <DemoDivider />
          </template>
        </TurtlePane>
      </TurtlePanes>
      <h1 class="demo-intro__logo-text">PANES</h1>
    </div>
    <p class="turtle-panes__description demo-intro__tagline">
      Easily build and manage multi-pane views. <br>
      Scroll down to see it in action.
    </p>
    <div>
      <div class="demo-intro__docs">
        <a href="/docs" class="demo-intro__button demo-intro__docs-link">
          <BookOpenText /> 
          <span> Docs </span>
        </a>
        <a href="https://github.com/sponsors/altinselimi" class="demo-intro__button demo-intro__donate-link">
          <HandCoins /> 
          <span> Sponsor </span>
        </a>
      </div>
      <div class="turtle-panes__links demo-intro__social-links">
        <a href="https://github.com/altinselimi/turtle-panes">
          <GitHubIcon />
        </a>
        <a href="https://bsky.app/profile/altinselimi.bsky.social">
          <BlueskyIcon />
        </a>
        <a href="https://www.npmjs.com/package/@turtle-panes/vue">
          <NpmIcon />
        </a>
      </div>
    </div>
    <DotLottieVue style="height: 10cqw; width: 10cqw" autoplay loop src="./scroll-down.lottie" />
  </Section>
</template>
<script setup lang="ts">
import { HandCoins, BookOpenText } from 'lucide-vue-next';
import { GitHubIcon, NpmIcon, BlueskyIcon } from "vue3-simple-icons";
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import Section from "./Section.vue";
import DemoDivider from "./DemoDivider.vue";
</script>
<style lang="scss" src="../styles/LettersDemo.scss">

</style>
