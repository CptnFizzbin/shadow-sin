import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { DamageTrack } from '../../DamageTrack/DamageTrack'
import { Stat, StatBlock } from '../../UI/StatBlock'
import { useAttachedGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../GearInfo'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { HandlingStat, SeatStat } from '../Vehicles/Stats'
import { VehicleModData } from '../Vehicles/VehicleModData'
import { DroneData } from './DroneData'

interface DroneInfoProps {
  drone: DroneData
}

export const DroneInfo: FC<DroneInfoProps> = ({
  drone,
}) => {
  const attachedMods = useAttachedGear<VehicleModData>(drone.id, {
    type: GearType.vehicleMod,
  })

  const autosofts = useGearOfType<AutosoftData>(GearType.autosoft)
    .filter(gear => gear.attachedTo === drone.id || drone.slavedAutosofts?.includes(gear.id))

  const physicalMax = Math.ceil(drone.body / 2) + 8

  return (
    <Paper elevation={1} sx={{ marginTop: 1 }}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={drone} type={[drone.size, drone.type, 'drone'].join(' ')} />
      </Box>

      <Box sx={{ padding: 1 }}>
        <StatBlock>
          <HandlingStat handling={drone.handling} />
          <Stat name={'Accel'} value={drone.accel} />
          <Stat name={'Speed Interval'} value={drone.speedInterval} />
          <Stat name={'Top Speed'} value={drone.topSpeed} />
          <Stat name={'Body'} value={drone.body} />
          <Stat name={'Armor'} value={drone.armor} />
          <Stat name={'Pilot'} value={drone.pilot} />
          <Stat name={'Sensor'} value={drone.pilot} />
          <SeatStat seat={drone.seat} />
        </StatBlock>
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ padding: 1 }}>
            <Typography variant={'h6'}>Autosofts</Typography>
            <AutosoftsList autosofts={autosofts} slavedIds={drone.slavedAutosofts} />
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
