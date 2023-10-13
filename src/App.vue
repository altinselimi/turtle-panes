<script setup>
import { TurtlePanes, TurtlePane, TurtlePaneSplitter } from "./components";
import { ref } from "vue";

const hidePane1 = ref(false);
const counterStrike = ref(1);
const bebe = ref(false);
const hidePane4 = ref(false);
</script>

<template>
  <!-- <h4 style="text-align: center">
    <span style="font-size: 2rem">🐢</span><br />Turtle Panes
  </h4> -->
  <div style="margin: auto">
    <button @click="hidePane1 = !hidePane1">Toggle pane 1</button>
    <button @click="hidePane4 = !hidePane4">Toggle pane 4</button>
    <button @click="counterStrike++">Increase counter</button>
  </div>
  <TurtlePanes class="turtle-demo-component__wrapper">
    <TurtlePane
      id="pane-1"
      v-if="!hidePane1"
      :initial-width="250"
      :min-width="50"
    >
      <div>
        Pane 1 <br />
        hidePane1: {{ hidePane1 }} <br />
        counter: {{ counterStrike }}
        <h4>Anna BAnnaAnnaAnnaAnnaAnnaAnnaAnnaAnnaAnnaAnnaAnna</h4>
      </div>
    </TurtlePane>
    <TurtlePaneSplitter v-if="!hidePane1" />
    <TurtlePane id="pane-2" :initial-width="350" :min-width="250">
      <div>Pane 2</div>
    </TurtlePane>
    <TurtlePaneSplitter />
    <TurtlePane id="pane-3" :initial-width="450" :grows-on-resize="true">
      <div>Pane 3</div>
    </TurtlePane>
    <TurtlePaneSplitter v-if="!hidePane4" />
    <TurtlePane
      id="pane-4"
      :initial-width="250"
      :min-width="280"
      v-if="!hidePane4"
    >
      <div>Pane 4</div>
    </TurtlePane>
  </TurtlePanes>
</template>

<style lang="scss">
.turtle-demo-component {
  &__wrapper {
    box-shadow: 0px 0px 0px 1px white;
    border-radius: 20px;
    margin: 20px;
  }
}
</style>
