<template>
  <TurtlePanes ref="turtlePanesRef" class="dashboard-demo__panes">
    <TurtlePane
      :max-width="250"
      :hide-on-min-width-exceeded="true"
      :prevent-content-overflow="true"
      :min-width="100"
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
    <TurtlePane :min-width="250" :is-flex="true">
      <div style="padding: 10px; width: 100%">
        <div class="is-placeholder" style="height: 100%"></div>
      </div>
    </TurtlePane>
    <TurtlePane
      :min-width="100"
      :max-width="250"
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
      :min-width="100"
      :max-width="250"
      :hide-on-min-width-exceeded="true"
    >
      <div style="padding: 10px; width: 100%">
        <div class="is-placeholder" style="height: 100px"></div>
      </div>
    </TurtlePane>
  </TurtlePanes>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import "@turtle-panes/vue/style";
import type { ExposedFunctions } from "../../packages/core/src/types";

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
</script>
<style lang="scss" src="../styles/RawDashboard.scss">

</style>
