import React, { FC, ReactElement } from "react"

import { GearData, GearType } from "./GearData"
import { GearInfoBlock } from "./GearInfoBlock"
import { LicenseData } from "./License/LicenseData"
import { LicenseInfo } from "./License/LicenseInfo"
import { SinData } from "./License/SinData"
import { SinInfo } from "./License/SinInfo"
import { RccData } from "./Rcc/RccData"
import { RccInfo } from "./Rcc/RccInfo"
import { VehicleData } from "./Vehicles/VehicleData"
import { VehicleInfo } from "./Vehicles/VehicleInfo"
import { WeaponData } from "./Weapons/WeaponData"
import { WeaponInfo } from "./Weapons/WeaponInfo"

export interface GearInfoProps<Type extends GearData = GearData> {
  item: Type
  title?: ReactElement
  subTitle?: ReactElement
}

export const GearInfo: FC<GearInfoProps> = ({ item }) => {
  switch (item.gearType) {
    case GearType.weapon:
      return <WeaponInfo item={item as WeaponData} />
    case GearType.vehicle:
      return <VehicleInfo item={item as VehicleData} />
    case GearType.rcc:
      return <RccInfo item={item as RccData} />
    case GearType.sin:
      return <SinInfo item={item as SinData} />
    case GearType.license:
      return <LicenseInfo item={item as LicenseData} />
    default:
      return <GearInfoBlock item={item} />
  }
}
