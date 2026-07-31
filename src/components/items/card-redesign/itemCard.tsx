import type { FC } from "react"

import { ArmorItemCard } from "#/components/items/types/armor/armorItemCard.tsx"
import { CredstickCard } from "#/components/items/types/credsticks/credstickCard.tsx"
import { DeviceItemCard } from "#/components/items/types/devices/deviceItemCard.tsx"
import { ProgramItemCard } from "#/components/items/types/devices/programItemCard.tsx"
import { ImplantItemCard } from "#/components/items/types/implants/implantItemCard.tsx"
import { LicenseCard } from "#/components/items/types/licenses/licenseCard.tsx"
import { SinCard } from "#/components/items/types/licenses/sinCard.tsx"
import { VehicleItemCard } from "#/components/items/types/vehicles/vehicleItemCard.tsx"
import { WeaponItemCard } from "#/components/items/types/weapons/weaponItemCard.tsx"
import type { ArmorData } from "#/system/gear/armorData.ts"
import type { CredstickData } from "#/system/gear/credstickData.ts"
import type { DeviceData } from "#/system/gear/deviceData.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ProgramData } from "#/system/gear/programData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { VehicleData } from "#/system/gear/vehicleData.ts"
import type { WeaponData } from "#/system/gear/weaponData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { BasicItemCard } from "./basicItemCard.tsx"

export interface ItemCardProps {
  item: ItemData
  /** When provided, the whole card becomes tappable/keyboard-activatable and doubles as the "Edit" quick action. */
  onOpen?: () => void
  /** When provided, adds a "Remove" quick action. Ignored by typed cards that manage their own removal. */
  onRemove?: () => void
}

/**
 * Renders the typed card for `item.itemType`, falling back to `BasicItemCard`
 * (common fields only, no type-specific slots) for item types without one
 * yet. This is the only module allowed to depend on every typed card — typed
 * cards must depend on `BasicItemCard`/`ItemCardSlot` instead of this file,
 * or importing it here would create a cycle.
 */
export const ItemCard: FC<ItemCardProps> = ({ item, onOpen, onRemove }) => {
  switch (item.itemType) {
    // The switch narrows `item.itemType`, not `item` itself, since ItemData
    // isn't a discriminated union of per-type interfaces; each case match
    // guarantees its cast is safe.
    case ItemType.weapon:
      return <WeaponItemCard weapon={item as WeaponData} onOpen={onOpen} />

    case ItemType.armor:
      return <ArmorItemCard armor={item as ArmorData} onOpen={onOpen} />

    case ItemType.license:
      return <LicenseCard license={item as LicenseData} onOpen={onOpen} />

    case ItemType.sin:
      return <SinCard sin={item as SinData} onOpen={onOpen} />

    case ItemType.credstick:
      return <CredstickCard credstick={item as CredstickData} onOpen={onOpen} />

    case ItemType.device:
      return <DeviceItemCard device={item as DeviceData} onOpen={onOpen} />

    case ItemType.program:
      return <ProgramItemCard program={item as ProgramData} onOpen={onOpen} />

    case ItemType.implant:
      return <ImplantItemCard implant={item as ImplantData} onOpen={onOpen} />

    case ItemType.vehicle:
      return <VehicleItemCard vehicle={item as VehicleData} onOpen={onOpen} />

    default:
      return <BasicItemCard item={item} onOpen={onOpen} onRemove={onRemove} />
  }
}
