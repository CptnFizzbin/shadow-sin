import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../../DamageTrack/DamageTrack'
import { Stat, StatBlock } from '../../UI/StatBlock'
import { useAttachedGear, useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { RccData } from '../Rigger/RccData'
import { RccStatBlock } from '../Rigger/RccInfo'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { HandlingStat, SeatStat } from './Stats'
import { VehicleData } from './VehicleData'

interface VehicleInfoProps {
  vehicle: VehicleData
}

export const VehicleInfo: FC<VehicleInfoProps> = ({
  vehicle,
}) => {
  const attachedMods = useAttachedGear(vehicle.id)

  const autosofts = useGearOfType<AutosoftData>(GearType.autosoft)
    .filter(gear => gear.attachedTo === vehicle.id || vehicle.slavedAutosofts?.includes(gear.id))

  const rcc = useGear<RccData>(vehicle.slavedTo)

  const physicalMax = Math.ceil(vehicle.body / 2) + 8

  return (
    <Paper elevation={1} sx={{ marginTop: 1 }}>
      <GearHeader gear={vehicle} />

      <Box sx={{ padding: 1 }}>
        <StatBlock>
          <HandlingStat handling={vehicle.handling} />
          <Stat name={'Accel'} value={vehicle.accel} />
          <Stat name={'Speed Interval'} value={vehicle.speedInterval} />
          <Stat name={'Top Speed'} value={vehicle.topSpeed} />
          <Stat name={'Body'} value={vehicle.body} />
          <Stat name={'Armor'} value={vehicle.armor} />
          <Stat name={'Pilot'} value={vehicle.pilot} />
          <Stat name={'Sensor'} value={vehicle.pilot} />
          <SeatStat seat={vehicle.seat} />
        </StatBlock>
      </Box>

      <Box sx={{ display: 'flex' }}>

        <Box sx={{ flexGrow: 1 }}>
          {rcc && (
            <Box sx={{ padding: 1 }}>
              <Typography variant={'h6'}>Slaved To</Typography>
              <Typography>{rcc.name}</Typography>
              <RccStatBlock rcc={rcc} />
            </Box>
          )}

          <Box sx={{ padding: 1 }}>
            <Typography variant={'h6'}>Autosofts</Typography>
            <AutosoftsList autosofts={autosofts} slavedIds={vehicle.slavedAutosofts} />
          </Box>
        </Box>

        <Box sx={{ padding: 1 }}>
          <DamageTrack current={0} max={physicalMax} label="Physical" />
        </Box>
      </Box>

      <NestedGear gear={attachedMods} />
    </Paper>
  )
}
