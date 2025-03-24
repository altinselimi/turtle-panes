# Turtle Panes 🐢

**Turtle Panes** is a pane management library designed for **Vue** and **React**, enabling flexible and efficient management of UI panes. It provides a simple and scalable API to create, organize, and control panes in your application.

---

## 🚀 Features

- 🖼️ **Flexible Pane Management:** Easily create and control panes in your UI.
- 🔌 **Works with Vue & React:** Designed specifically for these two frameworks.
- ⚡ **Lightweight & Fast:** Minimal overhead with a smooth user experience.
- 🚀 **Overflow Prevention:** Keep important content visible by preventing overflows.
- 📐 **Flexible Layouts:** Spread your panes flexibly or set precise widths.
- 👁️ **Hide/Show Panes:** Minimize or hide panes when they exceed a certain width limit.
- 🎨 **Custom Resizers:** Replace the default divider with your own.
- 🏗 **Vue Integration:** Uses a composable approach, works well with the Vue ecosystem.
- 📱 **Responsive Design:** Automatically adjusts to browser resizing for a seamless user experience.
- 🎛 **Fine-Grained Control:** Exposes functions to give developers precise control over pane behavior and interactions.
- 🛠 Zero Dependencies: No external dependencies for a leaner and more maintainable codebase.

---

## 📦 Installation

Turtle Panes provides separate packages for Vue and React. Install the package for your preferred framework:

### Vue:
```sh
npm install @turtlepanes/vue
```

### React:
```sh
npm install @turtlepanes/react
```

---

## 🛠 Getting Started

### Vue Example
```ts
<script setup>
import { TurtlePanes, TurtlePane } from "@turtle-panes/vue";
</script>
<template>
  <TurtlePanes>
    <TurtlePane> Hello World from Pane 1 </TurtlePane>
    <TurtlePane> Hello World from Pane 2 </TurtlePane>
  </TurtlePanes>
</template>
```
🔗 More details in the [Vue documentation](https://turtlepanes.altinselimi.com/vue/getting-started.html).

### React Example
```tsx
import TurtlePanes from '@turtle-panes/react';

const MyComponent = () => {
  return (
    <TurtlePanes>
      <TurtlePanes.Pane>
        Hello World from Pane 1
      </TurtlePanes.Pane>
      <TurtlePanes.Pane>
        Hello World from Pane 2
      </TurtlePanes.Pane>
    </TurtlePanes>
  );
};

export default MyComponent;
```
🔗 More details in the [React documentation](https://turtlepanes.altinselimi.com/react/getting-started.html).

---

## 📖 API Reference
Refer to the full API documentation:
- [Vue Docs](https://turtlepanes.altinselimi.com/vue/getting-started.html)
- [React Docs](https://turtlepanes.altinselimi.com/react/getting-started.html)

---

## 🤝 Contributing
Contributions are welcome! Please check out our [contribution guidelines](CONTRIBUTING.md) before making a pull request.

---

## 📜 License
Turtle Panes is licensed under the [GPL-3.0 license](LICENSE).

---

🎯 **Ready to simplify pane management?** Get started with Turtle Panes today!

---

