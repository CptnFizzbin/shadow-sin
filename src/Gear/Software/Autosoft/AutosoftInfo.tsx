import { FC } from 'react'

import { InfoBlock } from '../../../UI/InfoBlock/InfoBlock'
import { GearAttributes } from '../../GearAttributes'
import { GearHeader } from '../../GearHeader'
import { AutosoftData } from './AutosoftData'

interface AutosoftInfoProps {
  autosoft: AutosoftData
}

export const AutosoftInfo: FC<AutosoftInfoProps> = ({
  autosoft,
}) => {
  return (
    <InfoBlock>
      <InfoBlock.Header>
        <GearHeader item={autosoft} />
        <GearAttributes item={autosoft} />
      </InfoBlock.Header>
    </InfoBlock>
  )
}
