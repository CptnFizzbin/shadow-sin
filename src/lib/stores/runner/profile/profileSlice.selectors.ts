import { createSelector } from "reselect"

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
