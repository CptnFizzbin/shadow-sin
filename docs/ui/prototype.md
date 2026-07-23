# Prototype

**Location:** `src/components/ui/prototype/`
**Import:** `import { Prototype } from "#/components/ui/prototype/prototype.tsx"`

A compound component for switching between several in-progress prototypes/mockups in place. `Prototype` takes an
explicit `versions` list, and `Prototype.Item`s can be nested arbitrarily deep inside it — they don't need to be
direct children — so a prototype can swap out a component buried several levels down in an existing layout, even
inside components that only render later (a list item, a card in a `.map()`). A prev/next bar fixed to the bottom of
the screen switches between versions.

## Slots

| Slot                   | Description                                                                                                        |
|------------------------|---------------------------------------------------------------------------------------------------------------------|
| `Prototype`            | Root. Takes `versions: { key: string, name: string }[]` — the available versions, in switcher order                |
| `Prototype.Item`       | One prototype option. Takes a `version` matching a `versions[].key`, and renders its `children` when that version is selected |
| `usePrototypeVersion()`| Hook. Returns the nearest enclosing `Prototype`'s selected `key`, or `null` outside one. Use for default/fallback rendering instead of `Prototype.Item`'s show-or-hide — see "Consuming the selection directly" below. |

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

## Deep nesting

"Arbitrarily deep" isn't limited to JSX depth within one file — it also holds across component boundaries. A
`Prototype` mounted at the very top of the app (e.g. wrapping `<Outlet />` in `__root.tsx`) governs `Prototype.Item`s
anywhere in the whole tree: a shared component nested under any number of pages, dialogs, and list items, none of
which need to know a `Prototype` exists above them. This is how you preview a redesign of a widely-used component
"in the wild" — every real call site across the app, with real data — rather than only in an isolated demo.

There's one wrinkle at that scale: most of a shared component's call sites are also exercised by unit tests that
render the component standalone, with no `Prototype` ancestor. `Prototype.Item` resolves a missing ancestor as "no
selection," so a bare `Prototype.Item version="current"` renders nothing outside a `Prototype` — fine for a one-off
demo, but it would blank out a shared component (and fail its tests) everywhere the redesign hasn't shipped yet.

### Consuming the selection directly

For that case, reach for `usePrototypeVersion()` instead of `Prototype.Item`. It returns the nearest enclosing
`Prototype`'s selected key, or `null` when there is no ancestor — so the component can choose its *own* default
instead of disappearing:

```tsx
import { usePrototypeVersion } from "#/components/ui/prototype/prototype.tsx"

export const WidgetCard: FC<WidgetCardProps> = (props) => {
  const prototypeVersion = usePrototypeVersion()

  if (prototypeVersion === "B") return <WidgetCardVariantB {...props} />
  if (prototypeVersion === "C") return <WidgetCardVariantC {...props} />

  return <WidgetCardCurrent {...props} /> // default: no ancestor, "current", or any other key
}
```

Every existing caller of `WidgetCard` — and every test that renders it without a `Prototype` wrapper — keeps
rendering exactly as it does today. Only wrapping the app (or any subtree) in `<Prototype versions={...}>` switches
it on, and doing so at the app root switches it on everywhere at once, with a single switcher bar governing the
whole app rather than one per page.
