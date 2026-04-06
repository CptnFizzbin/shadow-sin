import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDataSchema,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/lib/system/magic/spellData.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

const defaultValues: SpellData = {
  id: NullUuid,
  name: "",
  type: SpellType.Physical,
  range: SpellRange.LoS,
  damage: SpellDamage.Physical,
  category: SpellCategory.Combat,
  drainValueMod: 0,
  dealsDamage: false,
  duration: SpellDuration.Instantaneous,
  threshold: "",
  voluntaryTargetsOnly: false,
  description: "",
  effects: [],
}

export interface SpellFormOptions {
  spell?: SpellData
  onSubmit: (values: SpellData) => void
}

export function useSpellForm(props: SpellFormOptions) {
  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...props.spell,
    },
    onSubmit: ({ value }) => props.onSubmit(value),
    validators: {
      onChange: SpellDataSchema,
    },
  })
}

export type SpellForm = ReturnType<typeof useSpellForm>
