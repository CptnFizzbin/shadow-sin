import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/items/gearSubmitMeta.ts"
import { useItemForm } from "#/lib/hooks/items/forms/useItemForm.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import { ItemType } from "#/system/itemType.ts"

interface DeviceFormOptions {
  device?: DeviceData
  onSubmit: (device: DeviceData, meta: GearSubmitMeta) => void
}

const defaultFormValues: DeviceData = {
  id: NullUuid,
  itemType: ItemType.device,
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
  deviceType: "commlink",
  customDeviceType: "",
  deviceModel: "",
  deviceOS: "",
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
  return useItemForm<DeviceData>({
    item: device,
    defaultValues: defaultFormValues,
    onSubmit,
  })
}
