import { useStore } from "@tanstack/react-store"
import { produce } from "immer"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { SpellData } from "#/lib/system/magic/spellData.ts"

export const useBuilderSpellsApi = () => {
  const store = useCharacterBuilderStoreContext()
  const spells = useStore(store, (state) => state.awakened.spells ?? [])

  return {
    spells,

    addSpell(spell: SpellData) {
      store.setState(produce((draft) => {
        draft.awakened.spells.push({ ...spell, id: crypto.randomUUID() })
      }))
    },

    updateSpell(spell: SpellData) {
      store.setState(produce((draft) => {
        draft.awakened.spells = draft.awakened.spells.map((s) =>
          s.id === spell.id ? spell : s,
        )
      }))
    },

    removeSpell(spell: SpellData) {
      store.setState(produce((draft) => {
        draft.awakened.spells = draft.awakened.spells.filter(
          (s) => s.id !== spell.id,
        )
      }))
    },
  }
}
