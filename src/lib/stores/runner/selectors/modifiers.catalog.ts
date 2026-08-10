import type { RunnerData } from "#/system/runnerData.ts"

import { selectWoundMod } from "./damage.selectors.ts"

/**
 * A modifier reachable from more than one catalog namespace — proof-of-concept for the "one
 * implementation, many namespaces" aliasing rule in
 * `docs/adr/0013-unify-runner-state-access.md`. A full `Modifier` catalog (covering every
 * GameEffect-driven stacking modifier, not just wound) is out of scope for this slice, so no
 * call site needs this export yet.
 */
// fallow-ignore-next-line unused-export
export enum Modifier {
  woundMod = "woundMod",
}

export interface ModifierFacets {
  value: number
}

export interface RunnerModifiersCatalog {
  (modifier: Modifier): ModifierFacets
}

export function buildModifiersCatalog(state: RunnerData): RunnerModifiersCatalog {
  return (modifier: Modifier): ModifierFacets => {
    switch (modifier) {
      case Modifier.woundMod:
        return { value: selectWoundMod(state) }
    }
  }
}
