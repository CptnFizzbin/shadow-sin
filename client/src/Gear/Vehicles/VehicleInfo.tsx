import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC } from 'react'

import { DamageProvider } from '../../System/Damage/DamageProvider'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { VehicleDefRatingStat } from '../../System/DefenseRating'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { DicePools } from '../../UI/DicePool'
import { StatBlock } from '../../UI/StatBlock'
import { useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearInfoProps } from '../GearInfo'
import { GearInfoBlock } from '../GearInfoBlock'
import { RccData } from '../Rcc/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { DestroyedVehicleInfo } from './DestroyedVehicleInfo'
import { AutosoftPiloting, DriverPiloting, RiggedPiloting, VehicleResistDmg } from './DicePools'
import { VehicleAttr } from './VehicleAttr'
import { VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

export const VehicleInfo: FC<GearInfoProps<VehicleData>> = ({ item: vehicle }) => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

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
          <Stack gap={1} direction={mdScreenOrLarger ? 'row-reverse' : 'column'} sx={{ flexWrap: 'wrap' }}>
            <Stack gap={1} direction={mdScreenOrLarger ? 'column' : 'row'} sx={{ flexWrap: 'wrap' }}>
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

              <DamageTrack type={DamageType.vehiclePhysical} max={physicalMax} label="Physical" />
            </Stack>

            <Box sx={{ flexGrow: 1 }}>
              <DicePools>
                <VehicleResistDmg vehicle={vehicle} />
                <DriverPiloting vehicle={vehicle} />
                <AutosoftPiloting vehicle={vehicle} />
                <RiggedPiloting vehicle={vehicle} />
              </DicePools>

              {rcc && (
                <Box>
                  <Typography variant={'h6'}>Slaved To</Typography>
                  <Typography>{rcc.name}</Typography>
                  <AttributeBlock attributes={rcc.attributes} />
                </Box>
              )}

              <Box>
                <Typography variant={'h6'}>Autosofts</Typography>
                <AutosoftsList autosofts={autosofts} slavedIds={rcc?.slavedAutosofts} />
              </Box>
            </Box>
          </Stack>
        </GearInfoBlock>
      </AutosoftProvider>
    </DamageProvider>
  )
}
