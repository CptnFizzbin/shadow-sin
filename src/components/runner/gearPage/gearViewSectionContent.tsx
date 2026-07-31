import type { FC } from "react"

import { ImplantItemList } from "#/components/items/types/implants/implantItemList.tsx"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ArmorSectionContent } from "./armorSectionContent.tsx"
import { DevicesSectionContent } from "./devicesSectionContent.tsx"
import { GearSection } from "./gearSectionTypes.ts"
import { GenericSectionContent } from "./genericSectionContent.tsx"
import { LicensesSectionContent } from "./licensesSectionContent.tsx"
import { VehiclesSectionContent } from "./vehiclesSectionContent.tsx"
import { WeaponsSectionContent } from "./weaponsSectionContent.tsx"

interface GearViewSectionContentProps {
  section: GearSection
  rootItems: ItemData[]
  getChildItems: (parentId: string) => ItemData[]
}

export const GearViewSectionContent: FC<GearViewSectionContentProps> = ({
  section,
  rootItems,
  getChildItems,
}) => {
  switch (section) {
    case GearSection.Cyberware:
      return <ImplantItemList />
    case GearSection.Weapons:
      return <WeaponsSectionContent />
    case GearSection.Licenses:
      return <LicensesSectionContent />
    case GearSection.Armor:
      return <ArmorSectionContent />
    case GearSection.Vehicles:
      return <VehiclesSectionContent />
    case GearSection.Devices:
      return <DevicesSectionContent />
    default:
      return (
        <GenericSectionContent
          items={rootItems}
          getChildren={getChildItems}
          itemLabel="Item"
          itemType={ItemType.other}
        />
      )
  }
}
