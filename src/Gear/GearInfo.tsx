import React, { FC } from 'react'

import { DefaultGearInfo } from './DefaultGearInfo'
import { GearData, GearType } from './GearData'
import { RccData } from './Rigger/RccData'
import { RccInfo } from './Rigger/RccInfo'
import { AutosoftData } from './Software/Autosoft/AutosoftData'
import { AutosoftInfo } from './Software/Autosoft/AutosoftInfo'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleInfo } from './Vehicles/VehicleInfo'
import { FirearmInfo } from './Weapons/Firearms/FirearmInfo'
import { WeaponData } from './Weapons/WeaponData'

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
  case GearType.other:
  default:
    return <DefaultGearInfo item={item} />
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type GearInfoBlock<Props = {}> = FC<GearInfoProps & Props>
