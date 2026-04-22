import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

export type SpellsStoreState = CharacterSheet["spells"]

export class SpellsStore extends StoreSlice<SpellsStoreState> {
  setState(stateOrUpdater: SpellsStoreState | ((prev: SpellsStoreState) => SpellsStoreState)) {
    this.set(stateOrUpdater)
  }

  add(spell: SpellData): void {
    this.set((prev) => [...prev, spell])
  }

  update(spell: SpellData): void {
    this.set((prev) => prev.map((s) => s.id === spell.id ? spell : s))
  }

  remove(spellId: string): void {
    this.set((prev) => prev.filter((s) => s.id !== spellId))
  }

  save(spell: SpellData): void {
    if (!spell.id || spell.id === NullUuid) {
      this.add({ ...spell, id: crypto.randomUUID() })
    } else {
      this.update(spell)
    }
  }
}
