import {
  selectMatrixTrack,
  selectPhysicalTrack,
  selectStunTrack,
} from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import type { MatrixNodeData } from "#/system/matrix/matrixNodeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectWoundMod } from "./damage.selectors.ts"

export const damageSelectorsCatalog = (activeMatrixNode?: MatrixNodeData) => ({
  woundMod: selectWoundMod,
  track: {
    physical: selectPhysicalTrack,
    sun: selectStunTrack,
    matrix: (runner: RunnerData) => {
      if (!activeMatrixNode) return null
      return selectMatrixTrack(runner, activeMatrixNode.matrix.system ?? activeMatrixNode.rating ?? 0)
    },
  },
})
