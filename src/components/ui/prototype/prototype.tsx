// fallow-ignore-file
import type { PrototypeItemProps } from "./prototypeItem.tsx"
import { PrototypeItem } from "./prototypeItem.tsx"
import type { PrototypeRootProps } from "./prototypeRoot.tsx"
import { PrototypeRoot } from "./prototypeRoot.tsx"

interface PrototypeComponent {
  (props: PrototypeRootProps): ReturnType<typeof PrototypeRoot>
  Item: typeof PrototypeItem
}

/**
 * Compound `Prototype` component for switching between multiple in-progress
 * prototypes/mockups without leaving the page. `Prototype.Item`s can be
 * nested arbitrarily deep in the tree; items sharing the same `name` are
 * shown or hidden together. A prev/next bar fixed to the bottom of the
 * screen switches between the named groups.
 *
 * See `docs/ui/prototype.md` for usage examples.
 */
export const Prototype = PrototypeRoot as unknown as PrototypeComponent
Prototype.Item = PrototypeItem

export type { PrototypeItemProps, PrototypeRootProps }
