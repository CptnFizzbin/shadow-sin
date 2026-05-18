import type { FC } from "react"

import { ImplantItemList } from "#/components/items/types/implants/implantItemList.tsx"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { ArmorSectionContent } from "./armorSectionContent.tsx"
import { FociSectionContent } from "./fociSectionContent.tsx"
import { GearSection } from "./gearSectionTypes.ts"
import { GenericSectionContent } from "./genericSectionContent.tsx"
import { LicensesSectionContent } from "./licensesSectionContent.tsx"
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
      return <WeaponsSectionContent items={rootItems} getChildren={getChildItems} />
    case GearSection.Licenses: {
      const sins = rootItems.filter(isSinData)
      const getLicenses = (sinId: string) =>
        getChildItems(sinId).filter(isLicenseData)

      return <LicensesSectionContent sins={sins} getLicenses={getLicenses} />
    }
    case GearSection.Armor:
      return <ArmorSectionContent items={rootItems} getChildren={getChildItems} />
    case GearSection.Vehicles:
      return (
        <GenericSectionContent
          items={rootItems}
          getChildren={getChildItems}
          itemLabel="Vehicle"
          itemType={ItemType.vehicle}
        />
      )
    case GearSection.Devices:
      return (
        <GenericSectionContent
          items={rootItems}
          getChildren={getChildItems}
          itemLabel="Device"
          itemType={ItemType.device}
        />
      )
    case GearSection.Foci:
      return <FociSectionContent items={rootItems} />
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
