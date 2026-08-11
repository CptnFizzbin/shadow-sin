import type { Selector } from "reselect"

import type { RunnerData } from "#/system/runnerData.ts"

// Catalog-internal — deliberately not exported from karmaSlice.selectors.ts alongside it, since
// useRunnerSelector's magicAdvancement namespace is the only intended reader. See
// docs/adr/0013-unify-runner-state-access.md.
const selectInitiateGrade: Selector<RunnerData, number> = (state) => state.initiateGrade
const selectSubmersionGrade: Selector<RunnerData, number> = (state) => state.submersionGrade

export const magicAdvancementCatalog = {
  initiateGrade: selectInitiateGrade,
  submersionGrade: selectSubmersionGrade,
}
