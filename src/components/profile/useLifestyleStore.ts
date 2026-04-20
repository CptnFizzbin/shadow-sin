import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { LifestyleType } from "#/system/lifestyleType.ts"

export type LifestyleStoreState = NonNullable<CharacterSheet["profile"]["lifestyle"]>

export class LifestyleStore extends StoreSlice<LifestyleStoreState> {
  setState(stateOrUpdater: LifestyleStoreState | ((prev: LifestyleStoreState) => LifestyleStoreState)) {
    this.set(stateOrUpdater)
  }

  setQuality(quality: LifestyleType): void {
    this.set((prev) => ({ ...(prev ?? { quality, monthsPaid: 1 }), quality }))
  }

  setMonthsPaid(months: number): void {
    this.set((prev) => ({ ...(prev ?? { quality: LifestyleType.Street, monthsPaid: months }), monthsPaid: months }))
  }
}

export const useLifestyleStore = (): LifestyleStore => {
  const store = useCharacterSheetContext()

  return useMemo((): LifestyleStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.profile.lifestyle ?? { quality: LifestyleType.Street, monthsPaid: 1 },
      (root, lifestyle) => ({
        ...root,
        profile: {
          ...root.profile,
          lifestyle,
        },
      }),
    )

    return new LifestyleStore(atom)
  }, [store])
}
