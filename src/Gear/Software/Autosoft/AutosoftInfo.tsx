import { Paper } from '@material-ui/core'
import { FC } from 'react'

import { GearAttributes } from '../../GearInfo/GearAttributes'
import { GearHeader } from '../../GearInfo/GearHeader'
import { AutosoftData } from './AutosoftData'

interface AutosoftInfoProps {
  autosoft: AutosoftData
}

export const AutosoftInfo: FC<AutosoftInfoProps> = ({
  autosoft,
}) => {
  return (
    <Paper elevation={1}>
      <GearHeader item={autosoft} />
      <GearAttributes item={autosoft} />
    </Paper>
  )
}
