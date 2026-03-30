import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export type QualitiesStoreState = CharacterSheet["qualities"]

export interface UseQualitiesStore extends BaseAtom<QualitiesStoreState> {
  add(quality: QualityData): void

  update(quality: QualityData): void

  remove(qualityId: string): void

  setState(updater: (prev: QualitiesStoreState) => QualitiesStoreState): void
}

export const useQualitiesStore = (): UseQualitiesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseQualitiesStore => {
    const qualitiesStore = createStore(() => store.state.qualities)

    const setQualitiesState = (updater: (prev: QualitiesStoreState) => QualitiesStoreState): void => {
      store.setState(produce((prev) => {
        prev.qualities = updater(prev.qualities)
      }))
    }

    return {
      get: () => qualitiesStore.get(),
      subscribe: (listener) => qualitiesStore.subscribe(listener),

      setState: setQualitiesState,

      add: (quality) => {
        setQualitiesState((prev) => {
          return [...prev, quality]
        })
      },

      update: (quality) => {
        setQualitiesState((prev) => {
          return prev.map((q) => q.name === quality.name ? quality : q)
        })
      },

      remove: (qualityId) => {
        setQualitiesState((prev) => {
          return prev.filter((q) => q.name !== qualityId)
        })
      },
    }
  }, [store])
}
