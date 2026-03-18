import { useStore } from "@tanstack/react-store"
import { useMemo } from "react"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import type { QualityData } from "#/lib/system/types/qualityData.ts"

export function useQualitiesFormGroup(form: PlayerCharacterForm) {
  const qualities = useStore(form.store, (s) => s.values.qualities)

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
    form.setFieldValue("qualities", (prev) => [...prev, quality])
  }

  const updateQuality = (quality: QualityData) => {
    form.setFieldValue("qualities", (prev) => {
      return prev.map((prevQuality) => {
        return prevQuality.id === quality.id ? quality : prevQuality
      })
    })
  }

  const removeQuality = (quality: QualityData) => {
    form.setFieldValue("qualities", (prev) =>
      prev.filter((prevQuality) => prevQuality.id !== quality.id),
    )
  }

  return {
    qualities: useMemo(
      () => ({
        positive: qualities.filter((q) => q.type === "positive"),
        negative: qualities.filter((q) => q.type === "negative"),
      }),
      [qualities],
    ),

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
