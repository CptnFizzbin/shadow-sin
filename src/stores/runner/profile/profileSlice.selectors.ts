import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"
import { Lifestyles } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ProfileSelectors.select` via `useRunnerSelector` instead. */
export function selectProfile(runner: RunnerData): RunnerData["profile"] {
  return mapToLegacySelector(runner, ProfileSelectors.select)
}

/** @deprecated Use `ProfileSelectors.selectName` via `useRunnerSelector` instead. */
export function selectProfileName(runner: RunnerData): string {
  return mapToLegacySelector(runner, ProfileSelectors.selectName)
}

/** @deprecated Use `ProfileSelectors.selectAlias` via `useRunnerSelector` instead. */
export function selectProfileAlias(runner: RunnerData): string {
  return mapToLegacySelector(runner, ProfileSelectors.selectAlias)
}

/**
 * The Runner's alias, falling back to their legal name when no alias is set.
 * @deprecated Use `ProfileSelectors.selectDisplayName` via `useRunnerSelector` instead.
 */
export function selectProfileDisplayName(runner: RunnerData): string {
  return mapToLegacySelector(runner, ProfileSelectors.selectDisplayName)
}

/** @deprecated Use `ProfileSelectors.selectLifestyle` via `useRunnerSelector` instead. */
export function selectLifestyle(runner: RunnerData): RunnerData["profile"]["lifestyle"] {
  return mapToLegacySelector(runner, ProfileSelectors.selectLifestyle)
}

/** @deprecated Use `ProfileSelectors.selectStreetCred` via `useRunnerSelector` instead. */
export function selectStreetCred(runner: RunnerData): number {
  return mapToLegacySelector(runner, ProfileSelectors.selectStreetCred)
}

/** @deprecated Use `ProfileSelectors.selectNotoriety` via `useRunnerSelector` instead. */
export function selectNotoriety(runner: RunnerData): number {
  return mapToLegacySelector(runner, ProfileSelectors.selectNotoriety)
}

/** @deprecated Use `ProfileSelectors.selectPublicAwarenessModifier` via `useRunnerSelector` instead. */
export function selectPublicAwarenessModifier(runner: RunnerData): number {
  return mapToLegacySelector(runner, ProfileSelectors.selectPublicAwarenessModifier)
}

/** @deprecated Use `ProfileSelectors.selectPublicAwareness` via `useRunnerSelector` instead. */
export function selectPublicAwareness(runner: RunnerData): number {
  return mapToLegacySelector(runner, ProfileSelectors.selectPublicAwareness)
}

/** @deprecated Use `ProfileSelectors.selectLifestyleQuality` via `useRunnerSelector` instead. */
export function selectLifestyleQuality(runner: RunnerData): ReturnType<typeof ProfileSelectors.selectLifestyleQuality> {
  return mapToLegacySelector(runner, ProfileSelectors.selectLifestyleQuality)
}

/** @deprecated Use `ProfileSelectors.selectLifestyleMonthsPaid` via `useRunnerSelector` instead. */
export function selectLifestyleMonthsPaid(runner: RunnerData): number | undefined {
  return mapToLegacySelector(runner, ProfileSelectors.selectLifestyleMonthsPaid)
}

/** @deprecated Use `ProfileSelectors.selectLifestyleInfo` via `useRunnerSelector` instead. */
export function selectLifestyleInfo(runner: RunnerData): ReturnType<typeof ProfileSelectors.selectLifestyleInfo> {
  return mapToLegacySelector(runner, ProfileSelectors.selectLifestyleInfo)
}

export namespace ProfileSelectors {
  export const select = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.profile,
  )

  export const selectName = createMemoizedSelector(
    select,
    (profile) => profile.name,
  )

  export const selectAlias = createMemoizedSelector(
    select,
    (profile) => profile.alias,
  )

  /** The Runner's alias, falling back to their legal name when no alias is set. */
  export const selectDisplayName = createMemoizedSelector(
    selectAlias,
    selectName,
    (alias, name) => alias || name,
  )

  export const selectLifestyle = createMemoizedSelector(
    select,
    (profile) => profile.lifestyle,
  )

  export const selectStreetCred = createMemoizedSelector(
    select,
    (profile) => profile.streetCred,
  )

  export const selectNotoriety = createMemoizedSelector(
    select,
    (profile) => profile.notoriety,
  )

  export const selectPublicAwarenessModifier = createMemoizedSelector(
    select,
    (profile) => profile.publicAwarenessModifier ?? 0,
  )

  export const selectPublicAwareness = createMemoizedSelector(
    selectStreetCred,
    selectNotoriety,
    selectPublicAwarenessModifier,
    (streetCred, notoriety, publicAwarenessModifier) =>
      Math.max(0, Math.floor((streetCred + notoriety) / 3) + publicAwarenessModifier),
  )

  export const selectLifestyleQuality = createMemoizedSelector(
    selectLifestyle,
    (lifestyle) => lifestyle?.quality,
  )

  export const selectLifestyleMonthsPaid = createMemoizedSelector(
    selectLifestyle,
    (lifestyle) => lifestyle?.monthsPaid,
  )

  export const selectLifestyleInfo = createMemoizedSelector(
    selectLifestyleQuality,
    (quality) => quality ? Lifestyles[quality] : undefined,
  )
}
