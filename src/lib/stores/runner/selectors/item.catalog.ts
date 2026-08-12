import { selectById, selectEquipped } from "#/lib/stores/runner/gear/gearSlice.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import type { ItemData } from "#/system/itemData.ts"
import type { ItemType } from "#/system/itemType.ts"
import type { ItemDataFor } from "#/system/items/itemUtils.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectArmorEffective, selectArmorTotal, selectEssence, selectItemsOfType } from "./item.selectors.ts"

export function buildItemCatalog(state: RunnerData) {
  const catalog = (id: UUID): ItemData | undefined => selectById(id)(state)

  return Object.assign(catalog, {
    byType: <T extends ItemType>(type: T): ItemDataFor<T>[] => selectItemsOfType(state, type) as ItemDataFor<T>[],
    equipped: selectEquipped(state),
    armor: {
      total: selectArmorTotal(state),
      effective: selectArmorEffective(state),
    },
    essence: selectEssence(state),
  })
}
