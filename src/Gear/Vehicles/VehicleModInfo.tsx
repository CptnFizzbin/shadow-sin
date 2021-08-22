import { FC } from 'react'

import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { VehicleModData } from './VehicleModData'

interface VehicleModInfoProps {
  mod: VehicleModData
}

export const VehicleModInfo: FC<VehicleModInfoProps> = ({
  mod,
}) => {
  return (
    <InfoBlock>
      <InfoBlock.Header>
        <GearHeader item={mod} />
        <NestedGear item={mod} />
      </InfoBlock.Header>
    </InfoBlock>
  )
}
