import { FC } from 'react'

import { DroneData } from './Drones/DroneData'
import { DroneInfo } from './Drones/DroneInfo'
import { GearData, GearType } from './GearData'
import { OtherGearInfo } from './OtherGearInfo'
import { AutosoftData } from './Software/Autosoft/AutosoftData'
import { AutosoftInfo } from './Software/Autosoft/AutosoftInfo'
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
    return <DroneInfo drone={gear as DroneData} />
  case GearType.vehicleMod:
    return <VehicleModInfo mod={gear as VehicleModData} />
  case GearType.other:
  default:
    return <OtherGearInfo gear={gear} />
  }
}
