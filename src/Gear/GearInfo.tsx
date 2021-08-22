import React, { FC } from 'react'

import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { GearAttributes } from './GearAttributes'
import { GearData, GearType } from './GearData'
import { GearHeader } from './GearHeader'
import { NestedGear } from './NestedGear'
import { RccData } from './Rcc/RccData'
import { RccInfo } from './Rcc/RccInfo'
import { AutosoftData } from './Software/Autosoft/AutosoftData'
import { AutosoftInfo } from './Software/Autosoft/AutosoftInfo'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleInfo } from './Vehicles/VehicleInfo'
import { VehicleModData } from './Vehicles/VehicleModData'
import { VehicleModInfo } from './Vehicles/VehicleModInfo'
import { WeaponData } from './Weapons/WeaponData'
import { WeaponInfo } from './Weapons/WeaponInfo'

interface GearInfoProps {
  item: GearData
}

export const GearInfo: FC<GearInfoProps> = ({
  item,
}) => {
  switch (item.gearType) {
  case GearType.weapon:
    return <WeaponInfo weapon={item as WeaponData} />
  case GearType.autosoft:
    return <AutosoftInfo autosoft={item as AutosoftData} />
  case GearType.drone:
  case GearType.vehicle:
    return <VehicleInfo vehicle={item as VehicleData} />
  case GearType.vehicleMod:
    return <VehicleModInfo mod={item as VehicleModData} />
  case GearType.rcc:
    return <RccInfo rcc={item as RccData} />
  default:
    return <DefaultGearInfo item={item} />
  }
}

export const DefaultGearInfo: FC<GearInfoProps> = ({
  item,
}) => {
  return (
    <InfoBlock>
      <InfoBlock.Header>
        <GearHeader item={item} />
        <GearAttributes item={item} />
      </InfoBlock.Header>

      <InfoBlock.Footer>
        <NestedGear item={item} />
      </InfoBlock.Footer>
    </InfoBlock>
  )
}
