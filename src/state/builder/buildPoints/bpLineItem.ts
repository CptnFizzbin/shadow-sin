import type { BuilderSectionId } from "#state/builder/builderSectionId.ts"

export interface BpLineItem {
  sectionId: BuilderSectionId
  spent: number
  allowance?: number
  enabled?: boolean
  isOverBudget?: boolean
}
