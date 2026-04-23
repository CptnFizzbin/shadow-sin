import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { useGearFilter } from "#/components/items/useGearStore.ts"
import { isCredstickData } from "#/system/gear/credstickData.ts"
import type { ItemData } from "#/system/itemData.ts"

export function useNetWorth(): number {
  const currentNuyen = useCharacterSheet((s) => s.nuyen.current)
  const loans = useCharacterSheet((s) => s.nuyen.loans)
  const allGear = useGearFilter((_item): _item is ItemData => true)

  const credstickTotal = allGear
    .filter(isCredstickData)
    .reduce((sum, credstick) => sum + credstick.balance, 0)

  const gearTotal = allGear
    .filter((item) => !isCredstickData(item))
    .reduce((sum, item) => sum + (item.cost ?? 0) * (item.quantity ?? 1), 0)

  const loansTotal = loans.reduce((sum, loan) => sum + loan.amount, 0)

  return currentNuyen + gearTotal + credstickTotal - loansTotal
}
