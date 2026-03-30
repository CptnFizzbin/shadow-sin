import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/StoreSlice.ts"
import { LifestyleType } from "#/lib/system/LifestyleType.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

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
      (root, lifestyle) => produce(root, (draft) => { draft.profile.lifestyle = lifestyle }),
    )

    return new LifestyleStore(atom)
  }, [store])
}
