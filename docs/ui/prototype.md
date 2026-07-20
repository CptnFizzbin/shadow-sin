# Prototype

**Location:** `src/components/ui/prototype/`
**Import:** `import { Prototype } from "#/components/ui/prototype/prototype.tsx"`

A compound component for switching between several in-progress prototypes/mockups in place. `Prototype` takes an
explicit `versions` list, and `Prototype.Item`s can be nested arbitrarily deep inside it — they don't need to be
direct children — so a prototype can swap out a component buried several levels down in an existing layout, even
inside components that only render later (a list item, a card in a `.map()`). A prev/next bar fixed to the bottom of
the screen switches between versions.

## Slots

| Slot              | Description                                                                                                        |
|-------------------|---------------------------------------------------------------------------------------------------------------------|
| `Prototype`       | Root. Takes `versions: { key: string, name: string }[]` — the available versions, in switcher order                |
| `Prototype.Item`  | One prototype option. Takes a `version` matching a `versions[].key`, and renders its `children` when that version is selected |

## Usage

```tsx
import { Prototype } from "#/components/ui/prototype/prototype.tsx"

const versions = [
  { key: "grid", name: "Grid layout" },
  { key: "list", name: "List layout" },
]

export const CardLayoutPrototypes = () => (
  <Prototype versions={versions}>
    <div>
      <div>
        <Prototype.Item version="grid">
          <GridContent />
        </Prototype.Item>
        <Prototype.Item version="list">
          <ListContent />
        </Prototype.Item>
      </div>
    </div>
  </Prototype>
)
```

Because selection is driven by the explicit `versions` list rather than scanning the tree for `Prototype.Item`s,
`Prototype.Item`s can live anywhere below `Prototype` — including inside components rendered from a `.map()` or any
other component that only produces its JSX later. Every item sharing a `version` key, however deeply nested, is
shown or hidden together as one unit. The first entry in `versions` is selected by default. Selection is local
component state — it resets whenever the `Prototype` unmounts. The bottom bar shows the current version's position
(`1 / 2`) and `name` between the prev/next buttons, and wraps around at either end.
