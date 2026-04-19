import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { ArmorData } from "#/lib/system/gear/armorData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface ArmorFormOptions {
  armor?: ArmorData
  onSubmit: (armor: ArmorData, meta: GearSubmitMeta) => void
}

const defaultFormValues: ArmorData = {
  id: NullUuid,
  itemType: ItemType.armor,
  name: "",
  ballistic: 0,
  impact: 0,
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
  effects: [],
}

export const armorFieldMap = createFieldMap(defaultFormValues)

export const armorFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useArmorForm = ({ armor, onSubmit }: ArmorFormOptions) => {
  const defaults: ArmorData = armor
    ? {
        ...defaultFormValues,
        ...armor,
        quantity: armor.quantity ?? 1,
      }
    : { ...defaultFormValues }

  return useAppForm({
    ...armorFormOpts,
    defaultValues: defaults,
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}
