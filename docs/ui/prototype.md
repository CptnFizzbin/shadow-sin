# Prototype

**Location:** `src/components/ui/prototype/`
**Import:** `import { Prototype } from "#/components/ui/prototype/prototype.tsx"`

A compound component for switching between several in-progress prototypes/mockups in place. It's designed to be
dropped in anywhere with minimal layout impact: the selected `Prototype.Item`'s content is wrapped in a thin,
padding-free border (so removing `Prototype` later leaves the layout essentially unchanged), and a floating
prev/next bar overlays the page to switch between options.

## Slots

| Slot              | Description                                                        |
|-------------------|----------------------------------------------------------------------|
| `Prototype.Item`  | One prototype option. Takes a `title` shown in the switcher bar and renders its `children` when selected |

## Usage

```tsx
import { Prototype } from "#/components/ui/prototype/prototype.tsx"

export const CardLayoutPrototypes = () => (
  <Prototype>
    <Prototype.Item title="Example 1">
      <ExampleOne />
    </Prototype.Item>
    <Prototype.Item title="Example 2">
      <ExampleTwo />
    </Prototype.Item>
  </Prototype>
)
```

The first item is selected by default. Selection is local component state — it resets whenever the `Prototype`
unmounts. The floating bar shows the current item's position (`1 / 2`) and title between the prev/next buttons, and
wraps around at either end.
