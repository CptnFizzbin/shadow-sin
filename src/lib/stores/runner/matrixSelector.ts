import type { Selector } from "reselect"

import type { MatrixNodeData } from "#/system/matrix/matrixNodeData.ts"

import { useRunnerStoreSelector } from "./runnerStore.selectors.ts"
import type { MatrixSelectorState } from "./selectors/matrix.catalog.ts"
import { matrixCatalog } from "./selectors/matrix.catalog.ts"

export type MatrixSelectorCatalog = typeof matrixCatalog

/**
 * Reads values relative to a specific `MatrixNode` — e.g. a damage track hosted on whichever node
 * a Program/Agent is currently running on (see `docs/adr/0012-matrix-entity-model.md`). Unlike
 * `useAttrSelector`'s nearest-provider resolution, `activeNode` is a required, explicit argument:
 * whoever needs a Matrix-relative value already knows which node it's asking about, so there's no
 * ambient Context to resolve it from.
 *
 * @example
 * const matrixDamage = useMatrixSelector(activeNode, ({ damage }) => damage.track)
 */
export function useMatrixSelector<T>(
  activeNode: MatrixNodeData,
  picker: (catalog: MatrixSelectorCatalog) => Selector<MatrixSelectorState, T>,
  compare?: (prev: T, next: T) => boolean,
): T {
  return useRunnerStoreSelector(
    (runner) => picker(matrixCatalog)({ runner, activeNode }),
    compare,
  )
}
