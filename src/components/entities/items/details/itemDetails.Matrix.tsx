import type { FC, ReactNode } from "react"

export interface ItemDetailsMatrixProps {
  children: ReactNode
}

/**
 * Content rendered inside the item's Matrix section, below its Matrix stats (e.g. the Programs on a
 * device). Hidden along with the section when the item has no Matrix presence.
 */
export const ItemDetailsMatrix: FC<ItemDetailsMatrixProps> = ({ children }) => <>{children}</>

ItemDetailsMatrix.displayName = "ItemDetails.Matrix"
