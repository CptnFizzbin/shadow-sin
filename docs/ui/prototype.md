# Prototype

**Location:** `src/components/ui/prototype/`
**Import:** `import { Prototype } from "#/components/ui/prototype/prototype.tsx"`

A compound component for switching between several in-progress prototypes/mockups in place. `Prototype.Item`s can be
nested arbitrarily deep inside `Prototype` — they don't need to be direct children — so a prototype can swap out a
component buried several levels down in an existing layout. A prev/next bar fixed to the bottom of the screen
switches between prototypes.

## Slots

| Slot              | Description                                                                                                        |
|-------------------|---------------------------------------------------------------------------------------------------------------------|
| `Prototype.Item`  | One prototype option. Takes a `name` used both as its unique key and as the label shown in the switcher bar, and renders its `children` when selected |

## Usage

```tsx
import { Prototype } from "#/components/ui/prototype/prototype.tsx"

export const CardLayoutPrototypes = () => (
  <Prototype>
    <div>
      <div>
        <Prototype.Item name="grid">
          <GridContent />
        </Prototype.Item>
        <Prototype.Item name="list">
          <ListContent />
        </Prototype.Item>
      </div>
    </div>
  </Prototype>
)
```

The `name` prop is the unique key `Prototype.Item`s are grouped by: every item sharing a `name`, however deeply
nested, is shown or hidden together as one unit. The first `name` encountered (in tree order) is selected by default.
Selection is local component state — it resets whenever the `Prototype` unmounts. The bottom bar shows the current
group's position (`1 / 2`) and name between the prev/next buttons, and wraps around at either end.
