import { selectInitiateGrade, selectSubmersionGrade } from "#/lib/stores/runner/karma/karmaSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function buildMagicAdvancementCatalog(state: RunnerData) {
  return {
    initiateGrade: selectInitiateGrade(state),
    submersionGrade: selectSubmersionGrade(state),
  }
}
