import type { SpellData } from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectSpells(state: RunnerData): SpellData[] {
  return state.spells
}
