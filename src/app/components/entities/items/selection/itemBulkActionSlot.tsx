import type { FC, PropsWithChildren } from "react"

import { useItemSelectionMode } from "#app/hooks/items/selection/useItemSelection.ts"

import { ItemBulkActionBar } from "./itemBulkActionBar.tsx"

/** Shows the bulk action bar in place of `children` while the gear list is in selection mode. */
export const ItemBulkActionSlot: FC<PropsWithChildren> = ({ children }) => {
  const { isSelecting } = useItemSelectionMode()
  return isSelecting ? <ItemBulkActionBar /> : children
}
