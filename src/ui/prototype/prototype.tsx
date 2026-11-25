// fallow-ignore-file
import type { PrototypeItemProps } from "./prototypeItem.tsx"
import { PrototypeItem } from "./prototypeItem.tsx"
import type { PrototypeRootProps, PrototypeVersion } from "./prototypeRoot.tsx"
import { PrototypeRoot } from "./prototypeRoot.tsx"

interface PrototypeComponent {
  (props: PrototypeRootProps): ReturnType<typeof PrototypeRoot>
  Item: typeof PrototypeItem
}

/**
 * Compound `Prototype` component for switching between multiple in-progress
 * prototypes/mockups without leaving the page. Takes an explicit `versions`
 * list (`{ key, name }[]`); `Prototype.Item version="key"` renders its
 * children only while that version is selected, no matter how deeply it's
 * nested under the enclosing `Prototype`. A prev/next bar fixed to the
 * bottom of the screen switches between versions.
 *
 * See `docs/ui/prototype.md` for usage examples.
 */
export const Prototype = Object.assign(PrototypeRoot, { Item: PrototypeItem }) as PrototypeComponent

export type { PrototypeItemProps, PrototypeRootProps, PrototypeVersion }
