import React, { FC } from 'react'

import { DefaultGearInfo } from './DefaultGearInfo'
import { GearData, GearType } from './GearData'
import { RccData } from './Rigger/RccData'
import { RccInfo } from './Rigger/RccInfo'
import { AutosoftData } from './Software/Autosoft/AutosoftData'
import { AutosoftInfo } from './Software/Autosoft/AutosoftInfo'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleInfo } from './Vehicles/VehicleInfo'
import { VehicleModData } from './Vehicles/VehicleModData'
import { VehicleModInfo } from './Vehicles/VehicleModInfo'
import { FirearmInfo } from './Weapons/Firearms/FirearmInfo'
import { WeaponData } from './Weapons/WeaponData'

interface GearInfoProps {
  gear: GearData
}

export const GearInfo: FC<GearInfoProps> = ({
  gear,
}) => {
  switch (gear.gearType) {
  case GearType.weapon:
    return <FirearmInfo firearm={gear as WeaponData} />
  case GearType.autosoft:
    return <AutosoftInfo autosoft={gear as AutosoftData} />
  case GearType.drone:
  case GearType.vehicle:
    return <VehicleInfo vehicle={gear as VehicleData} />
  case GearType.vehicleMod:
    return <VehicleModInfo mod={gear as VehicleModData} />
  case GearType.rcc:
    return <RccInfo rcc={gear as RccData} />
  case GearType.other:
  default:
    return <DefaultGearInfo gear={gear} />
  }
}
