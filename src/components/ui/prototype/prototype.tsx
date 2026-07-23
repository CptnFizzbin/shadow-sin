// fallow-ignore-file
import { useContext } from "react"

import { PrototypeSelectionContext } from "./prototypeContext.ts"
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
export const Prototype = PrototypeRoot as unknown as PrototypeComponent
Prototype.Item = PrototypeItem

/**
 * The `key` of the version selected by the nearest enclosing `Prototype`, or
 * `null` if there isn't one. Use this instead of `Prototype.Item` when a
 * component needs a *default* rendering rather than being hidden outright —
 * e.g. a shared component that should keep working (rendering its normal
 * output) everywhere it's used today, and only switch designs where an
 * ancestor `Prototype` happens to wrap it. See "Consuming the selection
 * directly" in `docs/ui/prototype.md`.
 */
export function usePrototypeVersion(): string | null {
  return useContext(PrototypeSelectionContext)
}

export type { PrototypeItemProps, PrototypeRootProps, PrototypeVersion }
