import type { FC } from "react"

import { ImplantItemList } from "#app/components/entities/items/types/implants/implantItemList.tsx"
import { SinsAndLicensesSection } from "#app/components/entities/items/types/licenses/sinsAndLicensesSection.tsx"

import { ArmorSectionContent } from "./armorSectionContent.tsx"
import { ConsumablesSectionContent } from "./consumablesSectionContent.tsx"
import { DevicesSectionContent } from "./devicesSectionContent.tsx"
import { GearSection } from "./gearSectionTypes.ts"
import { MagicalSectionContent } from "./magicalSectionContent.tsx"
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
      return <SinsAndLicensesSection />
    case GearSection.Armor:
      return <ArmorSectionContent />
    case GearSection.Vehicles:
      return <VehiclesSectionContent />
    case GearSection.Devices:
      return <DevicesSectionContent />
    case GearSection.Consumables:
      return <ConsumablesSectionContent />
    case GearSection.Magical:
      return <MagicalSectionContent />
    default:
      return <MiscSectionContent />
  }
}
