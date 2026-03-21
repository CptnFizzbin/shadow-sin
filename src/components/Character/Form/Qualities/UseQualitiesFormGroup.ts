import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export function useQualitiesFormGroup() {
  const qualitiesSlice = useCharacterBuilderStoreSlice(
    (state) => state.qualities,
  )
  const qualities = useCharacterBuilderStore((state) => state.qualities)

  let bpSpent = 0
  let bpBonus = 0

  qualities.forEach((quality) => {
    if (quality.type === "positive") {
      bpSpent += quality.bpValue ?? 0
    } else {
      bpBonus += quality.bpValue ?? 0
    }
  })

  const addQuality = (quality: QualityData) => {
    qualitiesSlice.update((draft) => {
      draft.push(quality)
    })
  }

  const updateQuality = (quality: QualityData) => {
    qualitiesSlice.update((draft) => {
      const index = draft.findIndex((q) => q.id === quality.id)
      if (index !== -1) draft[index] = quality
    })
  }

  const removeQuality = (quality: QualityData) => {
    qualitiesSlice.update((draft) => {
      const index = draft.findIndex((q) => q.id === quality.id)
      if (index !== -1) draft.splice(index, 1)
    })
  }

  return {
    qualities: {
      positive: qualities.filter((q) => q.type === "positive"),
      negative: qualities.filter((q) => q.type === "negative"),
    },

    buildPoints: {
      bpSpent: bpSpent,
      bpBonus: bpBonus,
      net: bpSpent - bpBonus,
    },

    addQuality,
    updateQuality,
    removeQuality,
  }
}
