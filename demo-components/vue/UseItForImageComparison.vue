<template>
  <Section
    contentStyle="align-items: stretch;"
  >
    <div
      class="turtle-panes__section-description"
    >
      <h1 class="turtle-panes__heading">Or compare images</h1>
      <p class="turtle-panes__description">Its all up to you really</p>
      <div class="demo-intro__source-code">
        <a :href="examplesUrl.react"><ReactIcon /> </a>
        <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <div class="before-after__wrapper">
      <img :src="leftImgSource" class="bottom-image" />
      <TurtlePanes
        style="position: absolute; top:0; left:0; width: 100%; height: 100%;"
      >
        <TurtlePane :initial-width="leftImgInitialWidth">
        </TurtlePane>
        <TurtlePane :is-flex="true">
          <div class="before-after__after-container">
            <img :src="rightImgSource" class="top-image" />
          </div>
        </TurtlePane>
      </TurtlePanes>
    </div>
    <div class="demo-framework-support__icons" style="justify-content: center;">
      <button class="demo-intro__button" @click="setImage('before')">
        <span>Set before</span>
      </button>
      <button class="demo-intro__button" @click="setImage('after')">
        <span>Set after</span>
      </button>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { ReactIcon, VueDotjsIcon as VueIcon } from "vue3-simple-icons";
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import Section from "./Section.vue";
import { ref } from 'vue';

const examplesUrl = {
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/UseItForImageComparison.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/UseItForImageComparison.vue`,
}

const leftImgSource = ref("/old-mustang.png");
const leftImgInitialWidth = document.body.clientWidth > 768 ? 300 : document.body.clientWidth / 2;

const rightImgSource = ref("/restored-old-mustang.png");

const setImage = (type: 'before' | 'after') => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') {
        leftImgSource.value = url;
      } else {
        rightImgSource.value = url;
      }
    }
  };
  input.click();
}

</script>
<style lang="scss" src="../styles/UseItForImageComparison.scss">
</style>
