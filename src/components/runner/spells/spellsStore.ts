import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { addSpell, removeSpell, saveSpell, spellsSlice, toggleSpellSustained, updateSpell } from "#/stores/runner/spells/spellsSlice.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export type SpellsStoreState = RunnerData["spells"]

export class SpellsStore extends StoreSlice<SpellsStoreState> {
  setState(stateOrUpdater: SpellsStoreState | ((prev: SpellsStoreState) => SpellsStoreState)) {
    this.set(stateOrUpdater)
  }

  /** @deprecated Dispatch `addSpell` from `#/stores/runner/spells/spellsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  add(spell: SpellData): void {
    this.set((prev) => spellsSlice.reducer(prev, addSpell(spell)))
  }

  /** @deprecated Dispatch `updateSpell` from `#/stores/runner/spells/spellsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  update(spell: SpellData): void {
    this.set((prev) => spellsSlice.reducer(prev, updateSpell(spell)))
  }

  /** @deprecated Dispatch `removeSpell` from `#/stores/runner/spells/spellsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  remove(spellId: string): void {
    this.set((prev) => spellsSlice.reducer(prev, removeSpell(spellId)))
  }

  /** @deprecated Dispatch `toggleSpellSustained` from `#/stores/runner/spells/spellsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  toggleSustained(spell: SpellData): void {
    this.set((prev) => spellsSlice.reducer(prev, toggleSpellSustained(spell.id)))
  }

  /** @deprecated Dispatch `saveSpell` from `#/stores/runner/spells/spellsSlice.ts` via `useRunnerStoreDispatch()` instead. */
  save(spell: SpellData): void {
    this.set((prev) => spellsSlice.reducer(prev, saveSpell(spell)))
  }
}
