import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { AwakeningData } from "#/system/awakeningType.ts"
import { awakenings } from "#/system/awakeningType.ts"
import type { MetatypeData } from "#/system/metatypeData.ts"
import { metatypes } from "#/system/metatypeData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `BiologySelectors.select` via `useRunnerSelector` instead. */
export function selectBiology(runner: RunnerData): RunnerData["biology"] {
  return mapToLegacySelector(runner, BiologySelectors.select)
}

/** @deprecated Use `BiologySelectors.selectMetatype` via `useRunnerSelector` instead. */
export function selectMetatype(runner: RunnerData): RunnerData["biology"]["metatype"] {
  return mapToLegacySelector(runner, BiologySelectors.selectMetatype)
}

/** @deprecated Use `BiologySelectors.selectAwakening` via `useRunnerSelector` instead. */
export function selectAwakening(runner: RunnerData): RunnerData["biology"]["awakening"] {
  return mapToLegacySelector(runner, BiologySelectors.selectAwakening)
}

/**
 * Denormalized {@link MetatypeData} looked up via {@link selectMetatype}.
 * @deprecated Use `BiologySelectors.selectMetatypeInfo` via `useRunnerSelector` instead.
 */
export function selectMetatypeData(runner: RunnerData): MetatypeData {
  return mapToLegacySelector(runner, BiologySelectors.selectMetatypeInfo)
}

/**
 * Denormalized {@link AwakeningData} looked up via {@link selectAwakening}.
 * @deprecated Use `BiologySelectors.selectAwakeningInfo` via `useRunnerSelector` instead.
 */
export function selectAwakeningData(runner: RunnerData): AwakeningData {
  return mapToLegacySelector(runner, BiologySelectors.selectAwakeningInfo)
}

export namespace BiologySelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.biology,
  )

  export const selectMetatype = createMemoizedSelector(
    select,
    (biology) => biology.metatype,
  )

  export const selectAwakening = createMemoizedSelector(
    select,
    (biology) => biology.awakening,
  )

  export const selectMetatypeInfo = createMemoizedSelector(
    selectMetatype,
    (metatype) => metatypes[metatype],
  )

  export const selectAwakeningInfo = createMemoizedSelector(
    selectAwakening,
    (awakening) => awakenings[awakening],
  )
}
