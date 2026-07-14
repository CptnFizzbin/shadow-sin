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
 * prototypes/mockups without leaving the page. Renders a tab bar of titles
 * above the content of whichever `Prototype.Item` is currently selected.
 *
 * See `docs/ui/prototype.md` for usage examples.
 */
export const Prototype = PrototypeRoot as unknown as PrototypeComponent
Prototype.Item = PrototypeItem

export type { PrototypeItemProps, PrototypeRootProps }
