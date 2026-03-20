import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export function useQualitiesFormGroup() {
  const store = useCharacterBuilderStoreContext()
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
    store.setState((prev) => ({
      ...prev,
      qualities: [...prev.qualities, quality],
    }))
  }

  const updateQuality = (quality: QualityData) => {
    store.setState((prev) => ({
      ...prev,
      qualities: prev.qualities.map((prevQuality) =>
        prevQuality.id === quality.id ? quality : prevQuality,
      ),
    }))
  }

  const removeQuality = (quality: QualityData) => {
    store.setState((prev) => ({
      ...prev,
      qualities: prev.qualities.filter(
        (prevQuality) => prevQuality.id !== quality.id,
      ),
    }))
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
