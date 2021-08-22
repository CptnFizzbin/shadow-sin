import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC, useState } from 'react'

import { DamageProvider } from '../../System/Damage/DamageContext'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { StatBlock } from '../../UI/StatBlock'
import { GearAttributes } from '../GearAttributes'
import { useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearDicePools } from '../GearDicePools'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { RccData } from '../Rcc/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { PilotEvadePool, RiggedEvadePool } from './DicePools'
import { VehicleAttr, VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

interface VehicleInfoProps {
  vehicle: VehicleData
}

export const VehicleInfo: FC<VehicleInfoProps> = ({
  vehicle,
}) => {
  const [damage, setDamage] = useState<number>(0)

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const rcc = useGear<RccData>(vehicle.slavedTo)
  const physicalMax = Math.ceil(vehicle.attributes[VehicleAttr.body] / 2) + 8
  const allAutosofts = useGearOfType<AutosoftData>(GearType.autosoft)

  const localAutosofts = allAutosofts
    .filter(gear => gear.attachedTo === vehicle.id)

  const slavedAutosofts: AutosoftData[] = []
  if (rcc) {
    allAutosofts
      .filter(autosoft => autosoft.attachedTo === rcc.id)
      .filter(autosoft => rcc.slavedAutosofts.includes(autosoft.id))
      .forEach(autosoft => slavedAutosofts.push(autosoft))
  }

  const autosofts = [...localAutosofts, ...slavedAutosofts]

  return (
    <Paper elevation={1} sx={{ marginTop: 1 }}>
      <GearHeader item={vehicle} />
      <GearAttributes item={vehicle} />


      <DamageProvider type={DamageType.vehiclePhysical} value={damage} onChange={setDamage}>
        <AutosoftProvider autosofts={autosofts}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>
              <GearDicePools>
                <PilotEvadePool vehicle={vehicle} />
                <RiggedEvadePool vehicle={vehicle} />
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
                <AutosoftsList autosofts={autosofts} slavedIds={slavedAutosofts.map(soft => soft.id)} />
              </InfoSection>
            </Box>

            <Box>
              <Box sx={{ padding: 1, paddingBottom: 0 }}>
                <StatBlock vertical>
                  <InitiativeStat name="Drone Init" base={pilot * 2} dice={4} />
                  {riggerInterface && (
                    <>
                      <CharacterHotVrInit />
                      <CharacterColdVrInit />
                    </>
                  )}
                </StatBlock>
              </Box>

              <Box sx={{ padding: 1 }}>
                <DamageTrack current={damage} max={physicalMax} onChange={setDamage} label="Physical" />
              </Box>
            </Box>
          </Box>

          <NestedGear item={vehicle} />
        </AutosoftProvider>
      </DamageProvider>
    </Paper>
  )
}
