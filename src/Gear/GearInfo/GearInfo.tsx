import React, { FC } from 'react'

import { GearData, GearType } from '../GearData'
import { RccData } from '../Rigger/RccData'
import { RccInfo } from '../Rigger/RccInfo'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftInfo } from '../Software/Autosoft/AutosoftInfo'
import { VehicleData } from '../Vehicles/VehicleData'
import { VehicleInfo } from '../Vehicles/VehicleInfo'
import { FirearmInfo } from '../Weapons/Firearms/FirearmInfo'
import { WeaponData } from '../Weapons/WeaponData'
import { DefaultGearInfo } from './DefaultGearInfo'

interface GearInfoProps {
  item: GearData
}

export const GearInfo: FC<GearInfoProps> = ({
  item,
}) => {
  switch (item.gearType) {
  case GearType.weapon:
    return <FirearmInfo firearm={item as WeaponData} />
  case GearType.autosoft:
    return <AutosoftInfo autosoft={item as AutosoftData} />
  case GearType.drone:
  case GearType.vehicle:
    return <VehicleInfo vehicle={item as VehicleData} />
  case GearType.rcc:
    return <RccInfo rcc={item as RccData} />
  default:
    return <DefaultGearInfo item={item} />
  }
}
