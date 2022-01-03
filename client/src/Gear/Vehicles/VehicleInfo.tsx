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
import { useAllNestedGear, useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
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
import {
  formatSlotType,
  isMountable,
  isSlottable,
  isVehicleMod,
  ModType,
  SlotType,
  VehicleModAttr,
  VehicleModData,
} from './VehicleModData'
import { VehicleSlots } from './VehicleSlots'


export const VehicleInfo: FC<GearInfoProps<VehicleData>> = ({item: vehicle}) => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const rcc = useGear<RccData>(vehicle.slavedTo)
  const physicalMax = Math.ceil(vehicle.attributes[VehicleAttr.body] / 2) + 8
  const allAutosofts = useGearOfType<AutosoftData>(GearType.autosoft)
  const vehicleMods = useAllNestedGear(vehicle.id)
    .filter(isVehicleMod)

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
            <Stack gap={1} direction={mdScreenOrLarger ? 'column' : 'row'} sx={{flexWrap: 'wrap'}}>
              <Box>
                <StatBlock vertical>
                  <InitiativeStat name='Drone Init' base={pilot * 2} dice={4} />
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
                <DamageTrack type={DamageType.vehiclePhysical} max={physicalMax} label='Physical' />
              </Box>
            </Stack>

            <Stack flexGrow={1} gap={1}>
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

              {vehicle.modSlots && (
                <Box>
                  <Typography variant={'h6'}>Mod Slots</Typography>
                  <Stack gap={1} direction='row' divider={<Divider orientation='vertical' flexItem />}>
                    {Object.entries(vehicle.modSlots).map(([type, slots]) => (
                      <VehicleSlots
                        key={type}
                        name={formatSlotType(type as SlotType)}
                        slots={slots}
                        items={
                          vehicleMods
                            .filter(isSlottable)
                            .filter(item => item.attributes[VehicleModAttr.slotType] === type)
                            .map(item => ({
                              id: item.id,
                              name: item.name,
                              size: item.attributes[VehicleModAttr.slotCost],
                            }))
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {vehicle.hardpoints && (
                <Box>
                  <Typography variant={'h6'}>Hardpoints</Typography>
                  <Stack gap={1} direction='row' divider={<Divider orientation='vertical' flexItem />}>
                    {Object.entries(vehicle.hardpoints).map(([size, slots]) => (
                      <VehicleSlots
                        key={size}
                        name={size}
                        slots={slots}
                        items={
                          vehicleMods
                            .filter(isMountable)
                            .filter(item => item.attributes[VehicleModAttr.hardpointSize] === size)
                            .map(item => ({
                              id: item.id,
                              name: item.name,
                              size: 1,
                            }))
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Stack>
        </GearInfoBlock>
      </AutosoftProvider>
    </DamageProvider>
  )
}
