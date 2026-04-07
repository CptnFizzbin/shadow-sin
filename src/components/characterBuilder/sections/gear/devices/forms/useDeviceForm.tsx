import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { defaultGearSubmitMeta } from "#/components/gear/gearSubmitMeta.ts"
import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import { GearType } from "#/lib/system/gearType.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"

export interface DeviceFormOptions {
  device?: DeviceData
  onSubmit: (device: DeviceData, meta: GearSubmitMeta) => void
}

const defaultFormValues: DeviceData = {
  id: NullUuid,
  itemType: GearType.device,
  name: "",
  cost: 0,
  quantity: 1,
  description: "",
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
  deviceRating: 0,
  response: 0,
  signal: 0,
  system: 0,
  firewall: 0,
  dataProcessing: 0,
  programSlots: 0,
}

export const deviceFieldMap = createFieldMap(defaultFormValues)

export const deviceFormOpts = formOptions({
  defaultValues: defaultFormValues,
})

export const useDeviceForm = ({ device, onSubmit }: DeviceFormOptions) => {
  return useAppForm({
    ...deviceFormOpts,
    defaultValues: {
      ...defaultFormValues,
      ...device,
    },
    onSubmitMeta: defaultGearSubmitMeta,
    onSubmit: ({ value, meta }) => onSubmit(value, meta),
  })
}
