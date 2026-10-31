import type { SpiritType } from "#/system/model/magic/spiritData.ts"
import { SpiritTypeLabels } from "#/system/model/magic/spiritData.ts"

const STOP_WORDS = new Set(["of", "the", "a", "an", "spirit", "spirits"])

function significantWords(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter((word) => word.length >= 2 && !STOP_WORDS.has(word))
}

/**
 * Whether a Summoning/Binding `specialization` (free text, e.g. "Spirits of Fire") covers
 * `spiritType`.
 */
export function spiritTypeMatchesSpecialization(spiritType: SpiritType, specialization: string): boolean {
  const specializationWords = significantWords(specialization)
  const labelWords = significantWords(SpiritTypeLabels[spiritType])
  return specializationWords.some((specWord) => labelWords.some((labelWord) => specWord.includes(labelWord) || labelWord.includes(specWord)))
}
