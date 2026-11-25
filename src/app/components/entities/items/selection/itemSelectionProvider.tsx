import type { FC, PropsWithChildren } from "react"
import { useState } from "react"

import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { getItemDescendantIds } from "#/rules/items/itemBulkActions.ts"
import { createItemSelectionStore } from "#/state/itemSelection/itemSelectionStore.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
