import type { ActionChain } from "#/integrations/reduxToolkit/dispatchActions.ts"
import { setAttribute } from "#/stores/runner/attributes/attributesSlice.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { burnEdgeCurrent } from "./edgeSlice.ts"

/**
 * Compound/cross-domain actions owned by the `edge` domain but not expressible as a single
 * `edgeSlice` reducer — they also touch `attributes`. Dispatch the result via
 * `useRunnerStoreDispatch()` (or `applyActions` directly); resolved and applied atomically in one
 * `setState` call.
 */

/**
 * Permanently reduces max Edge by 1 (never below 1) and resets the current pool to 0. A
 * `ActionChain` rather than a plain array because the new max is computed from the *current* max —
 * unlike a plain compound action, this can't be built until apply-time.
 */
export function burnEdge(): ActionChain<RunnerData> {
  return (state) => [
    burnEdgeCurrent(),
    setAttribute({ key: AttributeKey.edge, value: Math.max(1, state.attributes[AttributeKey.edge] - 1) }),
  ]
}
