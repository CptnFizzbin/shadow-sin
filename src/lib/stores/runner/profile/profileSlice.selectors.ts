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
