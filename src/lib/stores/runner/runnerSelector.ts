import { selectTrackWoundModifier } from "#/components/system/damage/damageUtils.ts"
import type { AttributesContextValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { useAttributesContext } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { selectMatrixTrack, selectPhysicalTrack, selectStunTrack } from "./damage/damageSlice.selectors.ts"
import { useRunnerStoreSelector } from "./runnerStore.selectors.ts"

export interface AttributeFacets {
  baseValue: number
  info: AttributeInfo
}

export interface RunnerAttributeCatalog {
  (key: AttributeKey): AttributeFacets
  infos: Record<AttributeKey, AttributeInfo>
}

export interface DamageTrackFacets {
  current: number
  max: number
}

export interface RunnerDamageCatalog {
  (track: DamageTrackKey): DamageTrackFacets
  woundMod: number
}

/**
 * A modifier reachable from more than one catalog namespace — proof-of-concept for the "one
 * implementation, many namespaces" aliasing rule in
 * `docs/adr/0013-unify-runner-state-access.md`. A full `Modifier` catalog (covering every
 * GameEffect-driven stacking modifier, not just wound) is out of scope for this slice.
 */
export enum Modifier {
  woundMod = "woundMod",
}

export interface ModifierFacets {
  value: number
}

export interface RunnerModifiersCatalog {
  (modifier: Modifier): ModifierFacets
}

/**
 * The namespaced menu `useRunnerSelector`'s callback picks from. Mirrors the existing
 * `Selectors.<domain>` split — each entry is either callable by key (returning a facet object)
 * or a bare property for a value that doesn't need one.
 */
export interface RunnerSelectorCatalog {
  attribute: RunnerAttributeCatalog
  damage: RunnerDamageCatalog
  modifiers: RunnerModifiersCatalog
}

const damageTrackSelectors = {
  [DamageTrackKey.physical]: selectPhysicalTrack,
  [DamageTrackKey.stun]: selectStunTrack,
  [DamageTrackKey.matrix]: selectMatrixTrack,
}

function selectWoundMod(state: RunnerData): number {
  return selectTrackWoundModifier(DamageTrackKey.physical)(state)
    + selectTrackWoundModifier(DamageTrackKey.stun)(state)
}

function buildAttributeCatalog(attributesContext: AttributesContextValue): RunnerAttributeCatalog {
  const catalog = (key: AttributeKey): AttributeFacets => ({
    baseValue: attributesContext.values[key] ?? 0,
    info: attributesContext.infos[key],
  })

  return Object.assign(catalog, { infos: attributesContext.infos })
}

function buildDamageCatalog(state: RunnerData): RunnerDamageCatalog {
  const catalog = (track: DamageTrackKey): DamageTrackFacets => {
    const { current, max } = damageTrackSelectors[track](state)
    return { current, max }
  }

  return Object.assign(catalog, { woundMod: selectWoundMod(state) })
}

function buildModifiersCatalog(state: RunnerData): RunnerModifiersCatalog {
  return (modifier: Modifier): ModifierFacets => {
    switch (modifier) {
      case Modifier.woundMod:
        // Same computation as `damage.woundMod` — reachable here too because "wound modifier"
        // is as much a Modifier concept as a Damage one. Never a second implementation.
        return { value: selectWoundMod(state) }
    }
  }
}

function buildRunnerSelectorCatalog(
  state: RunnerData,
  attributesContext: AttributesContextValue,
): RunnerSelectorCatalog {
  return {
    attribute: buildAttributeCatalog(attributesContext),
    damage: buildDamageCatalog(state),
    modifiers: buildModifiersCatalog(state),
  }
}

/**
 * The one way to read `RunnerData` — proof of concept for
 * `docs/adr/0013-unify-runner-state-access.md`. `picker` receives a namespaced catalog
 * (mirroring the existing `Selectors.<domain>` split) and returns whichever value it needs;
 * every catalog entry is backed by exactly one selector, never a parallel implementation.
 *
 * Only the `attribute` namespace resolves relative to a hosting entity today (via the nearest
 * `AttributesProvider`, currently always the Runner's own — see ADR-0013's non-goals). Every
 * other namespace reads `RunnerData` directly.
 *
 * @example
 * const system = useRunnerSelector(({ attribute }) => attribute(AttributeKey.system).baseValue)
 * const physicalDamage = useRunnerSelector(({ damage }) => damage(DamageTrackKey.physical).current)
 * const woundMod = useRunnerSelector(({ damage }) => damage.woundMod)
 */
export function useRunnerSelector<T>(
  picker: (catalog: RunnerSelectorCatalog) => T,
  compare?: (prev: T, next: T) => boolean,
): T {
  // Rules of Hooks — this runs unconditionally on every call, whether or not `picker` ends up
  // touching `attribute`, so every namespace the catalog can ever expose has to be gathered up
  // front, not lazily per-namespace.
  const attributesContext = useAttributesContext()

  return useRunnerStoreSelector(
    (state) => picker(buildRunnerSelectorCatalog(state, attributesContext)),
    compare,
  )
}
