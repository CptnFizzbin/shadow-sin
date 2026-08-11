import type { Selector } from "reselect"

import type { DamageTrackInfo } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { selectMatrixTrack } from "#/lib/stores/runner/damage/damageSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { MatrixNodeData } from "#/system/matrix/matrixNodeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface MatrixSelectorState {
  runner: RunnerData
  activeNode: MatrixNodeData
}

// MatrixNodeData.matrix is always fully specced (see its doc comment) — no `rating` fallback like
// a Device/other EntityData might need.
const selectMatrixDamageTrack: Selector<MatrixSelectorState, DamageTrackInfo> = ({ runner, activeNode }) =>
  selectMatrixTrack(runner, activeNode.matrix[AttributeKey.system] ?? 0)

export const matrixCatalog = {
  damage: {
    track: selectMatrixDamageTrack,
  },
}
