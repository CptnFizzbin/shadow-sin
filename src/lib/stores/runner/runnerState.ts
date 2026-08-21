import type { RunnerData } from "#/system/runnerData.ts"

/**
 * The `TState` shape for standardized Runner-domain selectors (see
 * docs/adr/0014-selector-input-decomposition.md) — `RunnerData` wrapped under a named key rather
 * than passed bare, so a selector that needs more than one stateful source (e.g. Runner data plus
 * an `ItemCatalog`, or a Matrix-relative selector needing the active node too) can compose its
 * `TState` by intersecting `RunnerState` with the other wrapper types (`EntityState<T>`,
 * `ItemsState`, ...) instead of redefining a bespoke multi-field state shape per selector.
 */
export interface RunnerState {
  runner: RunnerData
}
