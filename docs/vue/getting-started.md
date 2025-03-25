# Getting started

Turtle-Panes simplifies creating and managing multi-pane layouts in Vue. It’s useful when you need split-pane functionality, collapsible sidebars, or resizable panels in dashboards or comparison views. Use it whenever you need to split your UI into multiple sections that you can hide, show, or resize dynamically.

## Installation

You can install this package by running this command in your project:
`npm install @turtle-panes/vue`

## Features

- **Overflow Prevention**: Keep important content visible by preventing overflows.
- **Flexible Layouts**: Spread your panes flexibly or set precise widths.
- **Hide/Show Panes**: Minimize or hide panes when they exceed a certain width limit.
- **Custom Resizers**: Replace default divider with your own.
- **Vue Integration**: Uses a composable approach, works well with the Vue ecosystem.
- **Responsive Design**: Automatically adjusts to browser resizing for a seamless user experience.
- **Fine-Grained Control**: Exposes functions to give developers precise control over pane behavior and interactions.

## Usage

A very simple setup would be:

#### Vue

```vue
<script setup>
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
import '@turtle-panes/vue/style';
</script>
<template>
  <TurtlePanes>
    <TurtlePane> Hello World from Pane 1 </TurtlePane>
    <TurtlePane> Hello World from Pane 2 </TurtlePane>
  </TurtlePanes>
</template>
```

You should see horizontally placed panes with a divider in the middle, which should give you the ability to drag it left and right.
