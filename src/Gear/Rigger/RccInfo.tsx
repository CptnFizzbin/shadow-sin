import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { Stat, StatBlock } from '../../UI/StatBlock'
import { useAttachedGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { VehicleData } from '../Vehicles/VehicleData'
import { RccData } from './RccData'

interface RccInfoProps {
  rcc: RccData
}

export const RccInfo: FC<RccInfoProps> = ({
  rcc,
}) => {
  const autosofts = useAttachedGear<AutosoftData>(rcc.id, {
    type: GearType.autosoft,
  })

  const slavedVehicles: VehicleData[] = [
    ...useGearOfType<VehicleData>(GearType.drone),
    ...useGearOfType<VehicleData>(GearType.vehicle),
  ].filter(vehicle => vehicle.slavedTo === rcc.id)
  const maxSlaved = rcc.deviceRating * 3

  return (
    <Paper elevation={1}>
      <GearHeader gear={rcc} />

      <Box sx={{ padding: 1 }}>
        <RccStatBlock rcc={rcc} />
      </Box>

      <Box sx={{ padding: 1 }}>
        <Typography variant={'h6'}>Autosofts</Typography>
        <AutosoftsList autosofts={autosofts} />
      </Box>

      <Box sx={{ padding: 1 }}>
        <Typography variant={'h6'}>Slaved ({slavedVehicles.length} / {maxSlaved})</Typography>
        {slavedVehicles.map(gear => (
          <Typography key={gear.id}>{gear.name}</Typography>
        ))}
      </Box>
    </Paper>
  )
}

interface RccStatBlockProps {
  rcc: RccData
}

export const RccStatBlock: FC<RccStatBlockProps> = ({
  rcc,
}) => {
  return (
    <StatBlock>
      <Stat name="Device Rating" value={rcc.deviceRating} />
      <Stat name="Data Processing" value={rcc.dataProcessing} />
      <Stat name="Firewall" value={rcc.firewall} />
    </StatBlock>
  )
}
