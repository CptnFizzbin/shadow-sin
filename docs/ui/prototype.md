# Prototype

**Location:** `src/components/ui/prototype/`
**Import:** `import { Prototype } from "#/components/ui/prototype/prototype.tsx"`

A compound component for switching between several in-progress prototypes/mockups on the same page. It renders a
scrollable tab bar of titles; the content of whichever `Prototype.Item` is selected is shown below it. Useful when
exploring a few different UI approaches for the same feature side by side without wiring up separate routes.

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
unmounts.
