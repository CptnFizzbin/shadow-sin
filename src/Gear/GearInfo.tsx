import React, { FC } from 'react'

import { GearData, GearType } from './GearData'
import { GearInfoBlock } from './GearInfoBlock'
import { RccData } from './Rcc/RccData'
import { RccInfo } from './Rcc/RccInfo'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleInfo } from './Vehicles/VehicleInfo'
import { WeaponData } from './Weapons/WeaponData'
import { WeaponInfo } from './Weapons/WeaponInfo'

export interface GearInfoProps<Type extends GearData = GearData> {
  item: Type
  expanded?: boolean
}

export const GearInfo: FC<GearInfoProps> = ({
  item,
  expanded,
}) => {
  switch (item.gearType) {
  case GearType.weapon:
    return <WeaponInfo item={item as WeaponData} expanded={expanded} />
  case GearType.vehicle:
    return <VehicleInfo item={item as VehicleData} expanded={expanded} />
  case GearType.rcc:
    return <RccInfo item={item as RccData} expanded={expanded} />
  default:
    return <GearInfoBlock item={item} expanded={expanded} />
  }
}
