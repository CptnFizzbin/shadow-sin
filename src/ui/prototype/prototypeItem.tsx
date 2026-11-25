// fallow-ignore-file
import type { FC, ReactNode } from "react"
import { useContext } from "react"

import { PrototypeSelectionContext } from "./prototypeContext.ts"

export interface PrototypeItemProps {
  /**
   * `key` of the version (from the enclosing `Prototype`'s `versions` list)
   * this renders for. Renders `children` only while that version is
   * selected, no matter how deeply nested under the enclosing `Prototype`.
   */
  version: string
  children: ReactNode
}

export const PrototypeItem: FC<PrototypeItemProps> = ({ version, children }) => {
  const selectedKey = useContext(PrototypeSelectionContext)
  return selectedKey === version ? <>{children}</> : null
}

PrototypeItem.displayName = "Prototype.Item"
