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
 * prototypes/mockups without leaving the page. Wraps the selected
 * `Prototype.Item`'s content in a thin, padding-free border and overlays a
 * floating prev/next bar, so it can be dropped in around any component with
 * minimal layout impact.
 *
 * See `docs/ui/prototype.md` for usage examples.
 */
export const Prototype = PrototypeRoot as unknown as PrototypeComponent
Prototype.Item = PrototypeItem

export type { PrototypeItemProps, PrototypeRootProps }
