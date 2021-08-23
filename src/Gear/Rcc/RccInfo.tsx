import { Chip, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { GearAttributes } from '../GearAttributes'
import { useAttachedGear, useFilterGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearHeader } from '../GearHeader'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { VehicleData } from '../Vehicles/VehicleData'
import { RccAttr, RccData } from './RccData'

interface RccInfoProps {
  rcc: RccData
}

export const RccInfo: FC<RccInfoProps> = ({
  rcc,
}) => {
  const dataProcessing = rcc.attributes[RccAttr.dataProcessing]
  const autosofts = useAttachedGear(rcc.id)
    .filter(gear => gear.gearType === GearType.autosoft)
    .map(gear => gear as AutosoftData)

  const slavedVehicles: VehicleData[] = useFilterGear(gear => gear.slavedTo === rcc.id)
  const maxSlaved = rcc.attributes[RccAttr.deviceRating] * 3

  return (
    <InfoBlock>
      <InfoBlock.Header>
        <GearHeader item={rcc} />
        <GearAttributes item={rcc} />
      </InfoBlock.Header>

      <InfoBlock.Body>
        <InfoBlock.Main>
          <InfoSection>
            <Typography variant={'h6'}>Autosofts ({rcc.slavedAutosofts.length}/{dataProcessing} shared)</Typography>
            <AutosoftsList autosofts={autosofts} slavedIds={rcc.slavedAutosofts} />
          </InfoSection>

          <InfoSection>
            <Typography variant={'h6'}>Slaved ({slavedVehicles.length} / {maxSlaved})</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {slavedVehicles.map(gear => (
                <Chip key={gear.id} label={gear.name} />
              ))}
            </Box>
          </InfoSection>
        </InfoBlock.Main>
      </InfoBlock.Body>
    </InfoBlock>
  )
}
