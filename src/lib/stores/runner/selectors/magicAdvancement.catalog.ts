import type { RunnerData } from "#/system/runnerData.ts"

export const magicAdvancementCatalog = {
  initiateGrade: (state: RunnerData): number => state.initiateGrade,
  submersionGrade: (state: RunnerData): number => state.submersionGrade,
}
