import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#common/uuid/uuidUtils.ts"
import type { SpellData, SpellSustainTarget } from "#data/magic/spellData.ts"

export const addSpell = createAction<SpellData>("spells/add")
export const updateSpell = createAction<SpellData>("spells/update")
export const removeSpell = createAction<string>("spells/remove")
export const startSustainingSpell = createAction<{
  id: string
  target?: SpellSustainTarget
  /** The Sustaining Focus to hold the Spell; omitted or `null` means the caster sustains it. */
  sustainedBy?: string | null
}>("spells/startSustaining")
export const stopSustainingSpell = createAction<string>("spells/stopSustaining")
export const setSpellSustainTarget = createAction<{ id: string, target: SpellSustainTarget }>("spells/setSustainTarget")

export const saveSpell = createAction("spells/save", (spell: SpellData) => {
  if (!spell.id || spell.id === NullUuid) {
    return { payload: { ...spell, id: crypto.randomUUID() } }
  }
  return { payload: spell }
})
