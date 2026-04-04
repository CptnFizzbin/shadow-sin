import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"
import type { BpLineItem } from "#/components/CharacterBuilder/BuildPoints/bp-line-item.ts"
import { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"

export interface QualitiesBuildPoints extends BpLineItem {
  positive: number
  negative: number
}

export const useQualitiesBuildPoints = (): QualitiesBuildPoints => {
  const qualities = useCharacterSheet((sheet) => sheet.qualities)

  const positiveQualities = qualities
    .filter((q) => q.type === "positive")

  const positiveBp = positiveQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  const negativeQualities = qualities
    .filter((q) => q.type === "negative")

  const negativeBp = negativeQualities
    .reduce((acc, q) => acc + (q.bpValue ?? 0), 0)

  return {
    sectionId: BuilderSectionId.qualities,
    spent: positiveBp - negativeBp,
    positive: positiveBp,
    negative: negativeBp,
  }
}
