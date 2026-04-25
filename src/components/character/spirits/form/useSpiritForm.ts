import { useRef } from "react"

import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { generateSpiritName, SpiritType } from "#/system/magic/spiritData.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"

const defaultValues: SpiritData = {
  id: NullUuid,
  name: "",
  spiritType: SpiritType.man,
  force: 1,
  services: {
    max: 1,
    used: 0,
  },
  bound: false,
  optionalPowers: [],
  notes: "",
}

interface SpiritFormOptions {
  spirit?: SpiritData
  onSubmit: (values: SpiritData) => void
}

export function useSpiritForm(props: SpiritFormOptions) {
  const isNew = !props.spirit
  const initialType = props.spirit?.spiritType ?? defaultValues.spiritType
  const initialForce = props.spirit?.force ?? defaultValues.force
  const initialGenerated = generateSpiritName(initialType, initialForce)

  // Tracks the last auto-generated name so we can tell if the user has overwritten it
  const lastGenerated = useRef(isNew ? initialGenerated : "")

  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...props.spirit,
      name: isNew ? initialGenerated : (props.spirit?.name ?? ""),
      id: isNew || props.spirit?.id === NullUuid ? crypto.randomUUID() : props.spirit!.id,
    },
    listeners: {
      onChange: ({ formApi, fieldApi }) => {
        if (fieldApi.name !== "spiritType" && fieldApi.name !== "force") return

        const { name, spiritType, force } = formApi.state.values
        if (name !== "" && name !== lastGenerated.current) return

        const generated = generateSpiritName(spiritType, force)
        if (generated === name) return

        lastGenerated.current = generated
        formApi.setFieldValue("name", generated)
      },
    },
    onSubmit: ({ value }) => props.onSubmit(value),
  })
}

export type SpiritForm = ReturnType<typeof useSpiritForm>
