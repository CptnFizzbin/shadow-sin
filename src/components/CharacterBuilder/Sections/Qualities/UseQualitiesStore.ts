import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/StoreSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export type QualitiesStoreState = CharacterSheet["qualities"]

export class QualitiesStore extends StoreSlice<QualitiesStoreState> {
  setState(updater: (prev: QualitiesStoreState) => QualitiesStoreState): void {
    this.set(updater)
  }

  add(quality: QualityData): void {
    this.set((prev) => [...prev, quality])
  }

  update(quality: QualityData): void {
    this.set((prev) => prev.map((q) => q.name === quality.name ? quality : q))
  }

  remove(qualityName: string): void {
    this.set((prev) => prev.filter((q) => q.name !== qualityName))
  }
}

export const useQualitiesStore = (): QualitiesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): QualitiesStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.qualities,
      (root, qualities) => produce(root, (draft) => { draft.qualities = qualities }),
    )

    return new QualitiesStore(atom)
  }, [store])
}
