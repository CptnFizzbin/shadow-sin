import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useItemForm } from "#/components/items/forms/useItemForm.tsx"
import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SkillModEffect } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { FocusData } from "#/system/gear/focusData.ts"
import { FocusType } from "#/system/gear/focusData.ts"
import { ItemType } from "#/system/itemType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

interface FocusFormOptions {
  focus?: FocusData
  onSubmit: (focus: FocusData, meta: GearSubmitMeta) => void
}

const magicSkills: readonly SkillKey[] = [
  SkillKey.arcana,
  SkillKey.assensing,
  SkillKey.astralCombat,
  SkillKey.banishing,
  SkillKey.binding,
  SkillKey.counterspelling,
  SkillKey.enchanting,
  SkillKey.ritualSpellcasting,
  SkillKey.spellcasting,
  SkillKey.summoning,
]

export function getDefaultPowerFocusEffects(): SkillModEffect[] {
  return magicSkills.map((skill) => ({
    type: GameEffectType.skillMod,
    target: skill,
    value: 0,
  }))
}

const defaultFormValues: FocusData = {
  id: NullUuid,
  itemType: ItemType.focus,
  name: "",
  focusType: FocusType.Power,
  bonded: false,
  rating: 1,
  cost: 0,
  quantity: 1,
  description: "",
  equipped: false,
  availability: {
    rating: 0,
    restricted: false,
    forbidden: false,
  },
  source: {
    book: "",
    page: 0,
  },
  effects: getDefaultPowerFocusEffects(),
  spellCategory: undefined,
  slottedSpellId: undefined,
}

export const focusFieldMap = createFieldMap(defaultFormValues)

export const focusFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useFocusForm = ({ focus, onSubmit }: FocusFormOptions) => {
  return useItemForm<FocusData>({
    item: focus,
    defaultValues: defaultFormValues,
    onSubmit,
  })
}
