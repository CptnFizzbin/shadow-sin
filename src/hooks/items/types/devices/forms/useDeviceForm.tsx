import { createFieldMap, formOptions } from "@tanstack/form-core"

import type { GearSubmitMeta } from "#/components/entities/items/gearSubmitMeta.ts"
import { useItemForm } from "#/hooks/items/forms/useItemForm.tsx"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { DeviceData } from "#/system/model/items/deviceData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"
import type { UUID } from "#/utils/uuidUtils.ts"
import { NullUuid } from "#/utils/uuidUtils.ts"

interface DeviceFormOptions {
  device?: DeviceData
  parentId?: UUID
  onSubmit: (device: DeviceData, meta: GearSubmitMeta) => void
}

const defaultFormValues: DeviceData = {
  kind: EntityKind.item,
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
  items: { parentId: null, childIds: [] },
  effects: [],
  stashed: false,
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

export const useDeviceForm = ({ device, parentId, onSubmit }: DeviceFormOptions) => {
  return useItemForm<DeviceData>({
    item: device,
    defaultValues: parentId
      ? { ...defaultFormValues, items: { ...defaultFormValues.items, parentId } }
      : defaultFormValues,
    onSubmit,
  })
}
