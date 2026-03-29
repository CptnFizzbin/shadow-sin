import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/Hooks/UseCharacterSheetContext.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

export type SpellsStoreState = CharacterSheet["spells"]

export interface UseSpellsStore extends BaseAtom<SpellsStoreState> {
  add(spell: SpellData): void
  update(spell: SpellData): void
  remove(spellId: string): void

  setState(state: SpellsStoreState): void
  setState(updater: (prev: SpellsStoreState) => SpellsStoreState): void
}

export const useSpellsStore = (): UseSpellsStore => {
  const store = useCharacterSheetContext()

  return useMemo((): UseSpellsStore => {
    const spellsStore = createStore(() => store.state.spells)

    const toUpdater = <T>(valueOrUpdater: T | ((prev: T) => T)): ((prev: T) => T) =>
      typeof valueOrUpdater === "function"
        ? (valueOrUpdater as (prev: T) => T)
        : () => valueOrUpdater

    return {
      get: () => spellsStore.get(),
      subscribe: (listener) => spellsStore.subscribe(listener),

      setState: (stateOrUpdater) => {
        const updater = toUpdater(stateOrUpdater)
        store.setState(produce((prev) => {
          prev.spells = updater(prev.spells)
        }))
      },

      add: (spell) => {
        store.setState(produce((prev) => {
          prev.spells.push(spell)
        }))
      },

      update: (spell) => {
        store.setState(produce((prev) => {
          prev.spells = prev.spells.map((s) => s.id === spell.id ? spell : s)
        }))
      },

      remove: (spellId) => {
        store.setState(produce((prev) => {
          prev.spells = prev.spells.filter((s) => s.id !== spellId)
        }))
      },
    }
  }, [store])
}
