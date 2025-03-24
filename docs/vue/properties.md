# Properties
Below is a brief overview of the Vue component props:

### Pane:
- **minWidth** (`number`, default: `10`): The smallest allowed width for the pane.
- **initialWidth** (`number | undefined`): The pane’s width on creation if provided; otherwise falls back to either content width or `minWidth` (whichever is bigger).
- **maxWidth** (`number | undefined`): The largest allowed width for the pane.
- **hideOnMinWidthExceeded** (`boolean`, default: `false`): If true, the pane hides itself when forced below its `minWidth`.
- **preventContentOverflow** (`boolean`, default: `false`): If true, will prevent shrinking the pane when content starts overflowing. If it reaches `minWidth` then it follows whatever `hideOnMinWidthExceeded` specifies.
- **isVisible** (`boolean`, default: `true`): Whether the pane is visible.
- **isFlex** (`boolean`, default: `false`): If true, behaves flexibly in layouts (takes available space).
- **allowOverflow** (`boolean`, default: `false`): If true, pane content can extend beyond its boundary and scroll.
- **hideDivider** (`boolean`, default: `false`): If true, hides the divider associated with this pane.

### Divider
- **paneId** (`number`): Automatically populated. The numeric ID linked to the pane the divider resizes.

These props work together to control pane visibility, sizing constraints, and behavior when resizing.