import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { SpellData } from "#/lib/system/magic/spellData.ts"
import { SpellDataSchema } from "#/lib/system/magic/spellData.ts"

export type SpellFormOptions = { onSubmit: (values: SpellData) => void } & (
  | { mode: "create" }
  | { mode: "edit", spell: SpellData }
  )

export function useSpellForm(props: SpellFormOptions) {
  let defaultValues: SpellData

  if (props.mode === "edit") {
    defaultValues = props.spell
  } else {
    defaultValues = {
      id: crypto.randomUUID(),
      name: "",
      type: "Physical",
      range: "LoS",
      damage: "Physical",
      category: "Combat",
      drainValueMod: 0,
      dealsDamage: false,
      duration: "Instantaneous",
      threshold: "",
      voluntaryTargetsOnly: false,
      description: "",
    }
  }

  return useAppForm({
    defaultValues,
    onSubmit: ({ value }) => props.onSubmit(value),
    validators: {
      onChange: SpellDataSchema,
    },
  })
}

export type SpellForm = ReturnType<typeof useSpellForm>
