<template>
  <Section
    contentStyle="align-items: flex-start;"
  >
    <div class="turtle-panes__section-description">
      <h1 class="turtle-panes__heading">Use it to make dashboards</h1>
      <p class="turtle-panes__description">
        This library was inspired first and foremost for building multi pane
        dashboards.
      </p>
      <div class="demo-intro__source-code">
        <a :href="examplesUrl.react"><ReactIcon /> </a>
        <a :href="examplesUrl.vue"><VueIcon /> </a>
      </div>
    </div>
    <TurtlePanes ref="turtlePanesRef" class="dashboard-demo__panes">
      <TurtlePane
        :is-flex="true"
        :hide-on-min-width-exceeded="true"
        :min-width="50"
      >
        <div class="dashboard-demo__first-pane">
          <div class="is-placeholder" style="height: 40px"></div>
          <div style="height: 20px"></div>
          <div v-for="_ in [1, 2, 3, 4, 5]">
            <div
              class="is-placeholder"
              style="height: 20px; margin-bottom: 10px"
            ></div>
          </div>
          <div style="height: 20px"></div>
          <div class="is-placeholder" style="height: 20px"></div>
        </div>
      </TurtlePane>
      <TurtlePane :min-width="30" :is-flex="true" style="flex: 3">
        <div style="padding: 10px; width: 100%">
          <div class="is-placeholder" style="height: 100%"></div>
        </div>
      </TurtlePane>
      <TurtlePane
        :is-flex="true"
        :min-width="30"
        :hide-on-min-width-exceeded="true"
      >
        <div style="padding: 10px; width: 100%">
          <div class="is-placeholder" style="height: 40px"></div>
          <div
            class="is-placeholder"
            style="height: 40px; margin-top: 20px"
          ></div>
        </div>
      </TurtlePane>
      <TurtlePane
        :is-flex="true"
        :min-width="30"
        :hide-on-min-width-exceeded="true"
      >
        <div style="padding: 10px; width: 100%">
          <div class="is-placeholder" style="height: 100px"></div>
        </div>
      </TurtlePane>
    </TurtlePanes>
    <div class="dashboard-demo__hide-manually">
      <Checkbox
        v-for="pane in panes"
        v-model="pane.isChecked"
        @change="pane.onToggle()"
      >
        Pane {{ pane.id }}
      </Checkbox>
    </div>
  </Section>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue"
import Section from "./Section.vue";
import type { ExposedFunctions } from "@turtle-panes/core/types";
import Checkbox from "./Checkbox.vue";
import { ReactIcon, VueDotjsIcon as VueIcon } from "vue3-simple-icons";

const turtlePanesRef = ref<ExposedFunctions | null>(null);
const hiddenPanes = computed(() => turtlePanesRef.value?.hiddenPanes());
const panes = ref(
  [1, 2, 3, 4].map((id) => ({
    id,
    isChecked: true,
    onToggle() {
      if (this.isChecked) {
        turtlePanesRef.value?.reShowPane(this.id);
      } else {
        turtlePanesRef.value?.hidePane(id);
      }
    },
  })),
);
watchEffect(() => {
  hiddenPanes.value?.forEach((pane) => {
    panes.value[pane.id - 1].isChecked = false;
  });
});

const examplesUrl = {
  react: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/react/UseItForDashboards.tsx`,
  vue: `${import.meta.env.VITE_GITHUB_EXAMPLES_REPO}/vue/UseItForDashboards.vue`,
};
</script>
<style lang="scss" src="../styles/UseItForDashboards.scss">

</style>
