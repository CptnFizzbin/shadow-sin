import type { FC } from "react"

import { ArmorDataCard } from "#/components/items/types/armor/armorDataCard.tsx"
import { CredstickDataCard } from "#/components/items/types/credsticks/credstickDataCard.tsx"
import { DeviceDataCard } from "#/components/items/types/devices/deviceDataCard.tsx"
import { ProgramDataCard } from "#/components/items/types/devices/programDataCard.tsx"
import { ImplantDataCard } from "#/components/items/types/implants/implantDataCard.tsx"
import { LicenseDataCard } from "#/components/items/types/licenses/licenseDataCard.tsx"
import { SinDataCard } from "#/components/items/types/licenses/sinDataCard.tsx"
import { VehicleDataCard } from "#/components/items/types/vehicles/vehicleDataCard.tsx"
import { WeaponDataCard } from "#/components/items/types/weapons/weaponDataCard.tsx"
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

import { ItemCard } from "./itemCard.tsx"

export interface AnyItemCardProps {
  item: ItemData
  /** When provided, the whole card becomes tappable/keyboard-activatable and navigates to the item's details page. */
  onOpen?: () => void
  /** When provided, adds an "Edit" quick action (long-press/right-click menu) that opens the item's edit dialog. */
  onEdit?: () => void
  /** When provided, adds a "Remove" quick action. Ignored by typed cards that manage their own removal. */
  onRemove?: () => void
}

/**
 * Renders the typed card for `item.itemType`, falling back to `ItemCard`
 * (common fields only, no type-specific slots) for item types without one
 * yet. This is the only module allowed to depend on every typed card — typed
 * cards must depend on `ItemCard`/`EntityCard` instead of this file, or
 * importing it here would create a cycle.
 */
export const AnyItemCard: FC<AnyItemCardProps> = ({ item, onOpen, onEdit, onRemove }) => {
  switch (item.itemType) {
    // The switch narrows `item.itemType`, not `item` itself, since ItemData
    // isn't a discriminated union of per-type interfaces; each case match
    // guarantees its cast is safe.
    case ItemType.weapon:
      return <WeaponDataCard weapon={item as WeaponData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.armor:
      return <ArmorDataCard armor={item as ArmorData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.license:
      return <LicenseDataCard license={item as LicenseData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.sin:
      return <SinDataCard sin={item as SinData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.credstick:
      return <CredstickDataCard credstick={item as CredstickData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.device:
      return <DeviceDataCard device={item as DeviceData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.program:
      return <ProgramDataCard program={item as ProgramData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.implant:
      return <ImplantDataCard implant={item as ImplantData} onOpen={onOpen} onEdit={onEdit} />

    case ItemType.vehicle:
      return <VehicleDataCard vehicle={item as VehicleData} onOpen={onOpen} onEdit={onEdit} />

    default:
      return <ItemCard item={item} onOpen={onOpen} onEdit={onEdit} onRemove={onRemove} />
  }
}
