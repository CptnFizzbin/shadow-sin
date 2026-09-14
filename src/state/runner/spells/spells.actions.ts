import { createAction } from "@reduxjs/toolkit"

import type { SpellData } from "#/system/model/magic/spellData.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

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
