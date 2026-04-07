import { useNuyenStore } from "#/components/finances/nuyen/useNuyenStore.ts"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

export interface GearPurchaseHandlers {
  acquire: (item: ItemData, onClose: () => void) => void
  purchase: (item: ItemData, cost: number, onClose: () => void) => void
}

export const useGearPurchase = (): GearPurchaseHandlers => {
  const gearStore = useGearStore()
  const nuyenStore = useNuyenStore()

  const acquire = (item: ItemData, onClose: () => void) => {
    gearStore.save(item)
    onClose()
  }

  const purchase = (item: ItemData, cost: number, onClose: () => void) => {
    nuyenStore.withdraw(cost)
    gearStore.save(item)
    onClose()
  }

  return { acquire, purchase }
}
