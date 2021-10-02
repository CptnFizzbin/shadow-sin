import { Typography } from '@mui/material'
import { FC } from 'react'

import { DicePools } from '../UI/DicePool'
import { InfoSection } from '../UI/InfoBlock/InfoSection'

export const GearDicePools: FC = ({
  children,
}) => {
  return (
    <InfoSection>
      <Typography variant={'h6'}>Dice Pools</Typography>
      <DicePools>{children}</DicePools>
    </InfoSection>
  )
}
