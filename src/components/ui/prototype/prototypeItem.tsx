import type { FC, ReactNode } from "react"

export interface PrototypeItemProps {
  /** Label shown for this prototype in the switcher bar. */
  title: string
  children: ReactNode
}

export const PrototypeItem: FC<PrototypeItemProps> = ({ children }) => <>{children}</>

PrototypeItem.displayName = "Prototype.Item"
