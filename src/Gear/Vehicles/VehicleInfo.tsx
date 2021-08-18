import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../../DamageTrack/DamageTrack'
import { AttributeList } from '../../System/Attribute'
import { AttributeProvider, useAttributes } from '../../System/AttributeProvider'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { DicePools } from '../../UI/DicePool'
import { GearAttributes } from '../GearAttributes'
import { useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { RccData } from '../Rigger/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { PilotEvadePool, RiggedEvadePool } from './DicePools'
import { VehicleData } from './VehicleData'

interface VehicleInfoProps {
  vehicle: VehicleData
}

export const VehicleInfo: FC<VehicleInfoProps> = ({
  vehicle,
}) => {
  const autosofts = useGearOfType<AutosoftData>(GearType.autosoft)
    .filter(gear => gear.attachedTo === vehicle.id || vehicle.slavedAutosofts?.includes(gear.id))

  const rcc = useGear<RccData>(vehicle.slavedTo)

  const physicalMax = Math.ceil(vehicle.attributes.body.value / 2) + 8

  const attributes: AttributeList = {
    ...useAttributes(),
    ...vehicle.attributes,
  }

  return (
    <Paper elevation={1} sx={{ marginTop: 1 }}>
      <GearHeader item={vehicle} />
      <GearAttributes item={vehicle} />

      <AttributeProvider attributes={attributes}>
        <AutosoftProvider autosofts={autosofts}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>
              {rcc && (
                <Box sx={{ padding: 1 }}>
                  <Typography variant={'h6'}>Slaved To</Typography>
                  <Typography>{rcc.name}</Typography>
                  <AttributeBlock attributes={rcc.attributes} />
                </Box>
              )}

              <Box sx={{ padding: 1 }}>
                <Typography variant={'h6'}>Autosofts</Typography>
                <AutosoftsList autosofts={autosofts} slavedIds={vehicle.slavedAutosofts} />
              </Box>

              <Box sx={{ padding: 1 }}>
                <DicePools>
                  <PilotEvadePool vehicle={vehicle} />
                  <RiggedEvadePool vehicle={vehicle} />
                </DicePools>
              </Box>
            </Box>

            <Box sx={{ padding: 1 }}>
              <DamageTrack current={0} max={physicalMax} label="Physical" />
            </Box>
          </Box>

          <NestedGear item={vehicle} />
        </AutosoftProvider>
      </AttributeProvider>
    </Paper>
  )
}
