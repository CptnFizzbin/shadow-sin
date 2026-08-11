import type { Selector } from "reselect"

import { selectById, selectEquipped } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { ItemDataFor } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import {
  selectAllItems,
  selectArmorEffective,
  selectArmorTotal,
  selectEssence,
  selectItemsOfType,
} from "./item.selectors.ts"

export const itemCatalog = {
  all: selectAllItems,
  byId: selectById,
  byType: <T extends ItemType>(type: T): Selector<RunnerData, ItemDataFor<T>[]> =>
    (state) => selectItemsOfType(state, type) as ItemDataFor<T>[],
  equipped: selectEquipped,
  armor: {
    total: selectArmorTotal,
    effective: selectArmorEffective,
  },
  essence: selectEssence,
}
