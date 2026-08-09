import type { FC } from "react"

import { ImplantItemList } from "#/components/items/types/implants/implantItemList.tsx"

import { ArmorSectionContent } from "./armorSectionContent.tsx"
import { DevicesSectionContent } from "./devicesSectionContent.tsx"
import { GearSection } from "./gearSectionTypes.ts"
import { LicensesSectionContent } from "./licensesSectionContent.tsx"
import { MiscSectionContent } from "./miscSectionContent.tsx"
import { VehiclesSectionContent } from "./vehiclesSectionContent.tsx"
import { WeaponsSectionContent } from "./weaponsSectionContent.tsx"

interface GearViewSectionContentProps {
  section: GearSection
}

export const GearViewSectionContent: FC<GearViewSectionContentProps> = ({ section }) => {
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
      return <MiscSectionContent />
  }
}
