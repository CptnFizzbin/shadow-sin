import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { Stat, StatBlock } from '../../UI/StatBlock'
import { useAttachedGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { HandlingStat, SeatStat } from '../Vehicles/Stats'
import { VehicleModData } from '../Vehicles/VehicleModData'
import { VehicleModInfo } from '../Vehicles/VehicleModInfo'
import { DroneData } from './DroneData'

interface DroneInfoProps {
  drone: DroneData
}

export const DroneInfo: FC<DroneInfoProps> = ({
  drone,
}) => {
  const attachedMods = useAttachedGear(drone.id)
    .filter(gear => gear.gearType === GearType.vehicleMod)
    .map(gear => gear as VehicleModData)

  return (
    <Paper elevation={1}>
      <Box sx={{ padding: 1 }}>
        <GearHeader gear={drone} />
        <Box>
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
        <Box sx={{ paddingTop: 1 }}>
          <Paper variant="outlined">
            {attachedMods.map(child => <VehicleModInfo key={child.id} mod={child} />)}
          </Paper>
        </Box>
      </Box>
    </Paper>
  )
}
