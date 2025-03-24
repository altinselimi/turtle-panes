# Exposed Functions

The React version of the panes component provides three key functions on the component instance/reference:

- **`reShowPane(id: number)`**  
  Makes a previously hidden pane visible again.

- **`hidePane(id: number)`**  
  Manually hides a currently visible pane.

- **`hiddenPanes`**:  
  This is a static function and it's not reactive. Read further for how to listen to changes on hidden panes.

The `<Panes>` component provides a special property, `onPanesHidden`, which offers a workaround for tracking hidden panes. For example:

```jsx
<Panes
  onPanesHidden={(hiddenPaneIds) => setIsPaneHidden(!!hiddenPaneIds?.length)}
></Panes>
```

## Obtaining a Reference to the `<TurtlePanes>` Component

Use the `useRef` hook to obtain a reference to the component instance.  
Example:

```jsx
import React, { useRef, useEffect } from 'react';
import TurtlePanes from './TurtlePanes';

const App = () => {
  const turtlePanesRef = useRef(null);

  useEffect(() => {
    console.log(turtlePanesRef.current); // Access the component instance
  }, []);

  return <TurtlePanes ref={turtlePanesRef} />;
};

export default App;
```

Use this method to interact with the `<TurtlePanes>` component programmatically.

