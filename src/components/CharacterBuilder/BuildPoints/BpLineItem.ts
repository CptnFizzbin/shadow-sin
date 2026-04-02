import type { BuilderSectionId } from "#/components/CharacterBuilder/Sections/BuilderSectionId.ts"

export interface BpLineItem {
  sectionId: BuilderSectionId
  spent: number
  allowance?: number
  enabled?: boolean
  isOverBudget?: boolean
}
