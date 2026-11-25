import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDataSchema,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/model/magic/spellData.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

const defaultValues: SpellData = {
  kind: EntityKind.spell,
  id: NullUuid,
  name: "",
  type: SpellType.Physical,
  range: SpellRange.LoS,
  damage: SpellDamage.Physical,
  category: SpellCategory.Combat,
  drain: {
    type: SpellDrainType.Force,
    value: 0,
  },
  dealsDamage: false,
  duration: SpellDuration.Instantaneous,
  threshold: "",
  voluntaryTargetsOnly: false,
  description: "",
  effects: [],
}

interface SpellFormOptions {
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
