# Exposed Functions

The Vue version of the panes component provides three key functions on the component instance/reference:

- **`reShowPane(id: number)`**  
  Makes a previously hidden pane visible again.

- **`hidePane(id: number)`**  
  Manually hides a currently visible pane.

- **`hiddenPanes`**:  
  This is exposed as a computed property that will always have up-to-date information about the currently hidden panes.

## Obtaining a Reference to the `<TurtlePanes>` Component

Use the `ref` directive with `<script setup>` to obtain a reference to the component instance.  
Example:
```vue
<template>
  <TurtlePanes ref="turtlePanes" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TurtlePanes from './TurtlePanes.vue';

const turtlePanes = ref(null);

onMounted(() => {
  console.log(turtlePanes.value); // Access the component instance
});
</script>
```

Use these methods to interact with the `<TurtlePanes>` component programmatically.

