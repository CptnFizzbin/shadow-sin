import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectComplexForms(state: RunnerData): ComplexFormData[] {
  return state.complexForms
}
