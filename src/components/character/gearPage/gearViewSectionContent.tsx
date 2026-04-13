import type { FC } from "react"

import { CyberwareSectionContent } from "#/components/character/gearPage/cyberwareSectionContent.tsx"
import { GearSection } from "#/components/character/gearPage/gearSectionTypes.ts"
import { GenericSectionContent } from "#/components/character/gearPage/genericSectionContent.tsx"
import { LicensesSectionContent } from "#/components/character/gearPage/licensesSectionContent.tsx"
import { WeaponsSectionContent } from "#/components/character/gearPage/weaponsSectionContent.tsx"
import { isLicenseData } from "#/lib/system/gear/licenseData.ts"
import { isSinData } from "#/lib/system/gear/sinData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"

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
  if (section === GearSection.Cyberware) {
    return (
      <CyberwareSectionContent
        items={rootItems}
        getChildren={getChildItems}
      />
    )
  }

  if (section === GearSection.Weapons) {
    return (
      <WeaponsSectionContent
        items={rootItems}
        getChildren={getChildItems}
      />
    )
  }

  if (section === GearSection.Licenses) {
    const sins = rootItems.filter(isSinData)
    const getLicenses = (sinId: string) =>
      getChildItems(sinId).filter(isLicenseData)
    return (
      <LicensesSectionContent
        sins={sins}
        getLicenses={getLicenses}
      />
    )
  }

  if (section === GearSection.Armor) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Armor"
        gearType={ItemType.armor}
      />
    )
  }

  if (section === GearSection.Vehicles) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Vehicle"
        gearType={ItemType.vehicle}
      />
    )
  }

  if (section === GearSection.Devices) {
    return (
      <GenericSectionContent
        items={rootItems}
        getChildren={getChildItems}
        itemLabel="Device"
        gearType={ItemType.device}
      />
    )
  }

  // GearSection.Misc
  return (
    <GenericSectionContent
      items={rootItems}
      getChildren={getChildItems}
      itemLabel="Item"
      gearType={ItemType.other}
    />
  )
}
