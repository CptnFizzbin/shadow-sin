import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpellData } from "#/system/magic/spellData.ts"

export const addSpell = createAction<SpellData>("spells/add")
export const updateSpell = createAction<SpellData>("spells/update")
export const removeSpell = createAction<string>("spells/remove")
export const toggleSpellSustained = createAction<string>("spells/toggleSustained")

export const saveSpell = createAction("spells/save", (spell: SpellData) => {
  if (!spell.id || spell.id === NullUuid) {
    return { payload: { ...spell, id: crypto.randomUUID() } }
  }
  return { payload: spell }
})
