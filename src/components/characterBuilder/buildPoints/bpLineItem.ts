import type { BuilderSectionId } from "#/components/characterBuilder/sections/builderSectionId.ts"

export interface BpLineItem {
  sectionId: BuilderSectionId
  spent: number
  allowance?: number
  enabled?: boolean
  isOverBudget?: boolean
}
