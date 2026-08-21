import { createSelector } from "reselect"

import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { Lifestyles } from "#/system/lifestyleType.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectProfile(state: RunnerData): RunnerData["profile"] {
  return state.profile
}

export function selectProfileName(state: RunnerData): string {
  return state.profile.name
}

export function selectProfileAlias(state: RunnerData): string {
  return state.profile.alias
}

/** The Runner's alias, falling back to their legal name when no alias is set. */
export function selectProfileDisplayName(state: RunnerData): string {
  return state.profile.alias || state.profile.name
}

export function selectLifestyle(state: RunnerData): RunnerData["profile"]["lifestyle"] {
  return state.profile.lifestyle
}

export function selectStreetCred(state: RunnerData): number {
  return state.profile.streetCred
}

export function selectNotoriety(state: RunnerData): number {
  return state.profile.notoriety
}

export function selectPublicAwarenessModifier(state: RunnerData): number {
  return state.profile.publicAwarenessModifier ?? 0
}

export const selectPublicAwareness = createSelector(
  selectStreetCred,
  selectNotoriety,
  selectPublicAwarenessModifier,
  (streetCred, notoriety, publicAwarenessModifier) =>
    Math.max(0, Math.floor((streetCred + notoriety) / 3) + publicAwarenessModifier),
)

export const selectLifestyleQuality = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.quality,
)

export const selectLifestyleMonthsPaid = createSelector(
  selectLifestyle,
  (lifestyle) => lifestyle?.monthsPaid,
)

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
  export const select: Selector<RunnerData, RunnerData["profile"]> = legacy.selectProfile
  export const selectName: Selector<RunnerData, string> = legacy.selectProfileName
  export const selectAlias: Selector<RunnerData, string> = legacy.selectProfileAlias
  export const selectDisplayName: Selector<RunnerData, string> = legacy.selectProfileDisplayName
  export const selectLifestyle: Selector<RunnerData, RunnerData["profile"]["lifestyle"]> = legacy.selectLifestyle
  export const selectStreetCred: Selector<RunnerData, number> = legacy.selectStreetCred
  export const selectNotoriety: Selector<RunnerData, number> = legacy.selectNotoriety
  export const selectPublicAwarenessModifier: Selector<RunnerData, number> =
    legacy.selectPublicAwarenessModifier
  export const selectPublicAwareness: Selector<RunnerData, number> = legacy.selectPublicAwareness
  export const selectLifestyleQuality: Selector<RunnerData, ReturnType<typeof legacy.selectLifestyleQuality>> =
    legacy.selectLifestyleQuality
  export const selectLifestyleMonthsPaid: Selector<RunnerData, ReturnType<typeof legacy.selectLifestyleMonthsPaid>> =
    legacy.selectLifestyleMonthsPaid
  export const selectLifestyleInfo: Selector<RunnerData, ReturnType<typeof legacy.selectLifestyleInfo>> =
    legacy.selectLifestyleInfo
}
