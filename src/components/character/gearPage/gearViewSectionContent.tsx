import type { FC } from "react"

import { ArmorSectionContent } from "#/components/character/gearPage/armorSectionContent.tsx"
import { GearSection } from "#/components/character/gearPage/gearSectionTypes.ts"
import { GenericSectionContent } from "#/components/character/gearPage/genericSectionContent.tsx"
import { LicensesSectionContent } from "#/components/character/gearPage/licensesSectionContent.tsx"
import { WeaponsSectionContent } from "#/components/character/gearPage/weaponsSectionContent.tsx"
import { CyberwareList } from "#/components/implants/cyberwareList.tsx"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

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
      return <CyberwareList />
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
