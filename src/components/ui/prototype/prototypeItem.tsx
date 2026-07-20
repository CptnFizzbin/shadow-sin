// fallow-ignore-file
import type { FC, ReactNode } from "react"
import { useContext } from "react"

import { PrototypeSelectionContext } from "./prototypeContext.ts"

export interface PrototypeItemProps {
  /**
   * Unique key for this prototype option. Every `Prototype.Item` sharing the
   * same `name` is shown or hidden together, no matter how deeply each one is
   * nested under the enclosing `Prototype`.
   */
  name: string
  children: ReactNode
}

export const PrototypeItem: FC<PrototypeItemProps> = ({ name, children }) => {
  const selectedName = useContext(PrototypeSelectionContext)
  return selectedName === name ? <>{children}</> : null
}

PrototypeItem.displayName = "Prototype.Item"
