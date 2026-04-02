import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/character-sheet-provider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/atom-utils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/store-slice.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"
import type { QualityData } from "#/lib/system/quality-data.ts"

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
