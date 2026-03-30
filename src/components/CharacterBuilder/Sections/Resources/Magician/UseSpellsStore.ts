import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstack-store/AtomUtils.ts"
import { StoreSlice } from "#/integrations/tanstack-store/StoreSlice.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

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
}

export const useSpellsStore = (): SpellsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): SpellsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.spells,
      (root, spells) => produce(root, (draft) => { draft.spells = spells }),
    )

    return new SpellsStore(atom)
  }, [store])
}
