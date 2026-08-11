import type { Selector } from "reselect"

import { selectById, selectEquipped } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { ItemDataFor } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectArmorEffective, selectArmorTotal, selectEssence, selectItemsOfType } from "./item.selectors.ts"

// Delegates to `selectById` rather than exporting it directly — the catalog gains extra
// properties below via `Object.assign`, and mutating the shared `selectById` export in place
// would leak those onto every other caller of it.
const byId = (id: UUID): Selector<RunnerData, ItemData> => selectById(id)

export const itemCatalog = Object.assign(byId, {
  byType: <T extends ItemType>(type: T): Selector<RunnerData, ItemDataFor<T>[]> =>
    (state) => selectItemsOfType(state, type) as ItemDataFor<T>[],
  equipped: selectEquipped,
  armor: {
    total: selectArmorTotal,
    effective: selectArmorEffective,
  },
  essence: selectEssence,
})
