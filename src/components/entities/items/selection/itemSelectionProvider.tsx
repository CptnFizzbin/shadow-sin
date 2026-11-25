import type { FC, PropsWithChildren } from "react"
import { useState } from "react"

import { createItemSelectionStore } from "#/services/itemSelection/itemSelectionStore.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { getItemDescendantIds } from "#/system/formulas/items/itemBulkActions.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { ItemSelectionContext } from "./itemSelectionContext.ts"

/**
 * Gives a gear list its own Item selection, shared by every gear-type section beneath it (collapsed
 * or not), the Select toggle, and the bulk action bar. Mount inside the Runner's store provider.
 */
export const ItemSelectionProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(createItemSelectionStore)
  const catalog = useRunnerSelector(ItemSelectors.selectAll)

  const value = {
    store,
    getDescendantIds: (itemId: UUID) => getItemDescendantIds(catalog, itemId),
  }

  return <ItemSelectionContext.Provider value={value}>{children}</ItemSelectionContext.Provider>
}
