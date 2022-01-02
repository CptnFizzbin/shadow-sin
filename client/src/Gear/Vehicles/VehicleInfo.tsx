import { Box, Divider, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC } from 'react'

import { DamageProvider } from '../../System/Damage/DamageProvider'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { VehicleDefRatingStat } from '../../System/DefenseRating'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { DicePools } from '../../UI/DicePool'
import { StatBlock } from '../../UI/StatBlock'
import { useAttachedGear, useGear, useGearOfType } from '../GearContext'
import { GearType, getAttr } from '../GearData'
import { GearInfoProps } from '../GearInfo'
import { GearInfoBlock } from '../GearInfoBlock'
import { RccData } from '../Rcc/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { DestroyedVehicleInfo } from './DestroyedVehicleInfo'
import {
  DriverPiloting,
  DroneCracking,
  DroneEvasion,
  DroneManeuvering,
  DronePerception,
  DroneStealth,
  RiggedPiloting,
  VehicleResistDmg,
} from './DicePools'
import { VehicleAttr } from './VehicleAttr'
import { VehicleData } from './VehicleData'
import { formatSlotType, isVehicleMod, ModType, SlotType, VehicleModAttr, VehicleModData } from './VehicleModData'
import { VehicleModsList } from './VehicleModsList'

export const VehicleInfo: FC<GearInfoProps<VehicleData>> = ({ item: vehicle }) => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0
  const body = vehicle.attributes[VehicleAttr.body] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const vehicleMods = useAttachedGear(vehicle.id)
    .filter(isVehicleMod)

  const rcc = useGear<RccData>(vehicle.slavedTo)
  const physicalMax = Math.ceil(vehicle.attributes[VehicleAttr.body] / 2) + 8
  const allAutosofts = useGearOfType<AutosoftData>(GearType.autosoft)

  if (vehicle.destroyed) {
    return <DestroyedVehicleInfo item={vehicle} />
  }

  let autosofts = allAutosofts
    .filter(gear => gear.attachedTo === vehicle.id)

  if (rcc) {
    autosofts = [
      ...autosofts,
      ...allAutosofts
        .filter(autosoft => autosoft.attachedTo === rcc.id)
        .filter(autosoft => rcc.slavedAutosofts.includes(autosoft.id)),
    ]
  }

  return (
    <DamageProvider type={DamageType.vehiclePhysical} id={vehicle.id}>
      <AutosoftProvider autosofts={autosofts}>
        <GearInfoBlock item={vehicle}>
          <Stack gap={1} direction={mdScreenOrLarger ? 'row-reverse' : 'column'}>
            <Stack gap={1} direction={mdScreenOrLarger ? 'column' : 'row'} sx={{ flexWrap: 'wrap' }}>
              <Box>
                <StatBlock vertical>
                  <InitiativeStat name="Drone Init" base={pilot * 2} dice={4} />
                  {riggerInterface && (
                    <>
                      <CharacterHotVrInit />
                      <CharacterColdVrInit />
                    </>
                  )}
                  <VehicleDefRatingStat />
                </StatBlock>
              </Box>

              <Box>
                <DamageTrack type={DamageType.vehiclePhysical} max={physicalMax} label="Physical" />
              </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }}>
              <DicePools>
                <VehicleResistDmg vehicle={vehicle} />
                <DriverPiloting vehicle={vehicle} />
                <RiggedPiloting vehicle={vehicle} />

                <DroneEvasion vehicle={vehicle} />
                <DronePerception vehicle={vehicle} />
                <DroneStealth vehicle={vehicle} />
                <DroneManeuvering vehicle={vehicle} />
                <DroneCracking vehicle={vehicle} />
              </DicePools>

              {rcc && (
                <Box>
                  <Typography variant={'h6'}>Slaved To</Typography>
                  <Typography>{rcc.name}</Typography>
                  <AttributeBlock attributes={rcc.attributes} />
                </Box>
              )}

              {autosofts.length >= 1 && (
                <Box>
                  <Typography variant={'h6'}>Autosofts</Typography>
                  <AutosoftsList autosofts={autosofts} slavedIds={rcc?.slavedAutosofts} />
                </Box>
              )}

              <Box>
                <Typography variant={'h6'}>Mod slots</Typography>
                <Stack gap={1} sx={{ flexDirection: 'row' }}>
                  <Divider orientation="vertical" flexItem />
                  {Object.values(SlotType).map(slotType => (
                    <>
                      <VehicleModsList
                        key={slotType}
                        title={formatSlotType(slotType)}
                        mods={vehicleMods.filter(mod => getAttr(mod, VehicleModAttr.slotType) === slotType)}
                        maxSlots={body}
                      />
                      <Divider orientation="vertical" flexItem />
                    </>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Stack>
        </GearInfoBlock>
      </AutosoftProvider>
    </DamageProvider>
  )
}
