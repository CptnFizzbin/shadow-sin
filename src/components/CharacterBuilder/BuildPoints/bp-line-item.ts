import type { BuilderSectionId } from "#/components/CharacterBuilder/Sections/builder-section-id.ts"

export interface BpLineItem {
  sectionId: BuilderSectionId
  spent: number
  allowance?: number
  enabled?: boolean
  isOverBudget?: boolean
}
