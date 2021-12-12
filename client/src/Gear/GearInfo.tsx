import { Typography } from '@mui/material'
import React, { FC, ReactElement } from 'react'

import { formatAttr } from '../System/Attribute'
import { formatNuyen } from '../System/Nuyen'
import { formatSource } from '../System/Source'
import { SimpleInfoBlock } from '../UI/InfoBlock/SimpleInfoBlock'
import { Stat } from '../UI/StatBlock'
import { formatAvail } from './Availability'
import { useAttachedGear } from './GearContext'
import { GearData, GearType } from './GearData'
import { GearInfoBlock, WirelessBonus } from './GearInfoBlock'
import { GearList } from './GearList'
import { LicenseData } from './License/LicenseData'
import { LicenseInfo } from './License/LicenseInfo'
import { SinData } from './License/SinData'
import { SinInfo } from './License/SinInfo'
import { RccData } from './Rcc/RccData'
import { RccInfo } from './Rcc/RccInfo'
import { VehicleData } from './Vehicles/VehicleData'
import { VehicleInfo } from './Vehicles/VehicleInfo'
import { WeaponData } from './Weapons/WeaponData'
import { WeaponInfo } from './Weapons/WeaponInfo'

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
    case GearType.weaponMod:
    case GearType.armorMod:
    case GearType.vehicleMod:
      return <SimpleGearInfo item={item} />
    default:
      return <GearInfoBlock item={item} />
  }
}

export const SimpleGearInfo: FC<GearInfoProps> = ({ item }) => {
  const attachedGear = useAttachedGear(item.id)

  return (
    <SimpleInfoBlock
      name={item.name}
      attributes={
        <>
          {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
          {item.cost && <Stat name="Cost" value={formatNuyen(item.cost)} />}
          {item.source && <Stat name="Source" value={formatSource(item.source)} />}
          {item.attributes && Object.entries(item.attributes).map(([name, value]) => (
            <Stat key={name} name={formatAttr(name)} value={value} />
          ))}
        </>
      }
      body={
        <>
          {item.type && (
            <div><Typography variant="caption">{item.type}</Typography></div>
          )}
          {item.description && (
            <div><Typography variant="caption">{item.description}</Typography></div>
          )}
          {item.wirelessBonus?.description && (
            <WirelessBonus description={item.wirelessBonus.description} />
          )}
        </>
      }
      footer={attachedGear.length >= 1 ? <GearList gear={attachedGear} /> : undefined}
    >

    </SimpleInfoBlock>
  )
}
