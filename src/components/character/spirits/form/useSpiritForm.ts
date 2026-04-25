import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritType } from "#/system/magic/spiritData.ts"

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
  return useAppForm({
    defaultValues: {
      ...defaultValues,
      ...props.spirit,
      id: !props.spirit || props.spirit.id === NullUuid ? crypto.randomUUID() : props.spirit.id,
    },
    onSubmit: ({ value }) => props.onSubmit(value),
  })
}

export type SpiritForm = ReturnType<typeof useSpiritForm>
