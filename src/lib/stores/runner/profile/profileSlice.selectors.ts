import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { Lifestyles } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ProfileSelectors.select` via `useRunnerSelector` instead. */
export function selectProfile(state: RunnerData): RunnerData["profile"] {
  return state.profile
}

/** @deprecated Use `ProfileSelectors.selectName` via `useRunnerSelector` instead. */
export function selectProfileName(state: RunnerData): string {
  return state.profile.name
}

/** @deprecated Use `ProfileSelectors.selectAlias` via `useRunnerSelector` instead. */
export function selectProfileAlias(state: RunnerData): string {
  return state.profile.alias
}

/**
 * The Runner's alias, falling back to their legal name when no alias is set.
 * @deprecated Use `ProfileSelectors.selectDisplayName` via `useRunnerSelector` instead.
 */
export function selectProfileDisplayName(state: RunnerData): string {
  return state.profile.alias || state.profile.name
}

/** @deprecated Use `ProfileSelectors.selectLifestyle` via `useRunnerSelector` instead. */
export function selectLifestyle(state: RunnerData): RunnerData["profile"]["lifestyle"] {
  return state.profile.lifestyle
}

/** @deprecated Use `ProfileSelectors.selectStreetCred` via `useRunnerSelector` instead. */
export function selectStreetCred(state: RunnerData): number {
  return state.profile.streetCred
}

/** @deprecated Use `ProfileSelectors.selectNotoriety` via `useRunnerSelector` instead. */
export function selectNotoriety(state: RunnerData): number {
  return state.profile.notoriety
}

/** @deprecated Use `ProfileSelectors.selectPublicAwarenessModifier` via `useRunnerSelector` instead. */
export function selectPublicAwarenessModifier(state: RunnerData): number {
  return state.profile.publicAwarenessModifier ?? 0
}

/** @deprecated Use `ProfileSelectors.selectPublicAwareness` via `useRunnerSelector` instead. */
export const selectPublicAwareness = createSelector(
  selectStreetCred,
  selectNotoriety,
  selectPublicAwarenessModifier,
  (streetCred, notoriety, publicAwarenessModifier) =>
    Math.max(0, Math.floor((streetCred + notoriety) / 3) + publicAwarenessModifier),
)

/** @deprecated Use `ProfileSelectors.selectLifestyleQuality` via `useRunnerSelector` instead. */
export const selectLifestyleQuality = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.quality,
)

/** @deprecated Use `ProfileSelectors.selectLifestyleMonthsPaid` via `useRunnerSelector` instead. */
export const selectLifestyleMonthsPaid = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.monthsPaid,
)

/** @deprecated Use `ProfileSelectors.selectLifestyleInfo` via `useRunnerSelector` instead. */
export const selectLifestyleInfo = createSelector(
  selectLifestyleQuality,
  (quality) => quality ? Lifestyles[quality] : undefined,
)

const legacy = {
  selectProfile,
  selectProfileName,
  selectProfileAlias,
  selectProfileDisplayName,
  selectLifestyle,
  selectStreetCred,
  selectNotoriety,
  selectPublicAwarenessModifier,
  selectPublicAwareness,
  selectLifestyleQuality,
  selectLifestyleMonthsPaid,
  selectLifestyleInfo,
}

/** Standardized, namespaced selectors for the Profile domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace ProfileSelectors {
  export const select: Selector<{ runner: RunnerData }, RunnerData["profile"]> = (state) => legacy.selectProfile(state.runner)
  export const selectName: Selector<{ runner: RunnerData }, string> = (state) => legacy.selectProfileName(state.runner)
  export const selectAlias: Selector<{ runner: RunnerData }, string> = (state) => legacy.selectProfileAlias(state.runner)
  export const selectDisplayName: Selector<{ runner: RunnerData }, string> = (state) =>
    legacy.selectProfileDisplayName(state.runner)
  export const selectLifestyle: Selector<{ runner: RunnerData }, RunnerData["profile"]["lifestyle"]> = (state) =>
    legacy.selectLifestyle(state.runner)
  export const selectStreetCred: Selector<{ runner: RunnerData }, number> = (state) => legacy.selectStreetCred(state.runner)
  export const selectNotoriety: Selector<{ runner: RunnerData }, number> = (state) => legacy.selectNotoriety(state.runner)
  export const selectPublicAwarenessModifier: Selector<{ runner: RunnerData }, number> = (state) =>
    legacy.selectPublicAwarenessModifier(state.runner)
  export const selectPublicAwareness: Selector<{ runner: RunnerData }, number> = (state) =>
    legacy.selectPublicAwareness(state.runner)
  export const selectLifestyleQuality: Selector<{ runner: RunnerData }, ReturnType<typeof legacy.selectLifestyleQuality>> =
    (state) => legacy.selectLifestyleQuality(state.runner)
  export const selectLifestyleMonthsPaid: Selector<{ runner: RunnerData }, ReturnType<typeof legacy.selectLifestyleMonthsPaid>> =
    (state) => legacy.selectLifestyleMonthsPaid(state.runner)
  export const selectLifestyleInfo: Selector<{ runner: RunnerData }, ReturnType<typeof legacy.selectLifestyleInfo>> = (state) =>
    legacy.selectLifestyleInfo(state.runner)
}
