import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { QualityData } from "#/lib/system/qualityData.ts"

export const useBuilderQualitiesApi = () => {
  const store = useCharacterBuilderStoreContext()
  const qualities = useStore(store, (state) => state.qualities)

  return {
    qualities,

    addQuality(quality: QualityData) {
      store.setState(produce((draft) => {
        draft.qualities.push({ ...quality, id: crypto.randomUUID() })
      }))
    },

    updateQuality(quality: QualityData) {
      store.setState(produce((draft) => {
        draft.qualities = draft.qualities.map((q) =>
          q.id === quality.id ? quality : q,
        )
      }))
    },

    removeQuality(quality: QualityData) {
      store.setState(produce((draft) => {
        draft.qualities = draft.qualities.filter((q) => q.id !== quality.id)
      }))
    },
  }
}
