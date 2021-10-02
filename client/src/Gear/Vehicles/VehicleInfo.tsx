import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import { FC } from 'react'

import { DamageProvider } from '../../System/Damage/DamageProvider'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { VehicleDefRatingStat } from '../../System/DefenseRating'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { StatBlock } from '../../UI/StatBlock'
import { useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearDicePools } from '../GearDicePools'
import { GearInfoProps } from '../GearInfo'
import { GearInfoBlock } from '../GearInfoBlock'
import { RccData } from '../Rcc/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { DriverPiloting, AutosoftPiloting, RiggedPiloting } from './DicePools'
import { VehicleAttr } from './VehicleAttr'
import { VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

export const VehicleInfo: FC<GearInfoProps<VehicleData>> = ({
  item: vehicle,
  expanded,
}) => {
  const theme = useTheme()
  const mdScreenOrLarger = useMediaQuery(theme.breakpoints.up('md'))

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const rcc = useGear<RccData>(vehicle.slavedTo)
  const physicalMax = Math.ceil(vehicle.attributes[VehicleAttr.body] / 2) + 8
  const allAutosofts = useGearOfType<AutosoftData>(GearType.autosoft)

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
        <GearInfoBlock item={vehicle} expanded={expanded}>
          <Box sx={{ display: 'flex', flexDirection: mdScreenOrLarger ? 'row-reverse' : 'column', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', flexDirection: mdScreenOrLarger ? 'column' : 'row', padding: 1, gap: 1 }}>
              <Box>
                <Typography variant={'h6'}>Combat</Typography>
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
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <GearDicePools>
                <DriverPiloting vehicle={vehicle} />
                <AutosoftPiloting vehicle={vehicle} />
                <RiggedPiloting vehicle={vehicle} />
              </GearDicePools>

              {rcc && (
                <InfoSection>
                  <Typography variant={'h6'}>Slaved To</Typography>
                  <Typography>{rcc.name}</Typography>
                  <AttributeBlock attributes={rcc.attributes} />
                </InfoSection>
              )}

              <InfoSection>
                <Typography variant={'h6'}>Autosofts</Typography>
                <AutosoftsList autosofts={autosofts} slavedIds={rcc?.slavedAutosofts} />
              </InfoSection>
            </Box>
          </Box>
        </GearInfoBlock>
      </AutosoftProvider>
    </DamageProvider>
  )
}
