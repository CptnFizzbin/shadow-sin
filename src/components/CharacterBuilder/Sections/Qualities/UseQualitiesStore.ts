import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/Hooks/UseCharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { QualityData } from "#/lib/system/qualityData.ts"

export type QualitiesStoreState = CharacterSheet["qualities"]

export interface UseQualitiesStore extends BaseAtom<QualitiesStoreState> {
  add(quality: QualityData): void
  update(quality: QualityData): void
  remove(qualityId: string): void

  setState(state: QualitiesStoreState): void
  setState(updater: (prev: QualitiesStoreState) => QualitiesStoreState): void
}

export const useQualitiesStore = (): UseQualitiesStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseQualitiesStore => {
    const qualitiesStore = createStore(() => store.state.qualities)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => qualitiesStore.get(),
      subscribe: (listener) => qualitiesStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.qualities = updater(prev.qualities)
        }))
      },

      add: (quality) => {
        store.setState(produce((prev) => {
          prev.qualities.push({ ...quality, id: crypto.randomUUID() })
        }))
      },

      update: (quality) => {
        store.setState(produce((prev) => {
          prev.qualities = prev.qualities.map((q) => q.id === quality.id ? quality : q)
        }))
      },

      remove: (qualityId) => {
        store.setState(produce((prev) => {
          prev.qualities = prev.qualities.filter((q) => q.id !== qualityId)
        }))
      },
    }
  }, [store])
}
