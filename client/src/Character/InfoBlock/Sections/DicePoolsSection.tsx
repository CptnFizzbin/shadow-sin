import { Typography } from '@material-ui/core'
import { FC } from 'react'

import { DicePools } from '../../../UI/DicePool'
import { InfoSection } from '../../../UI/InfoBlock/InfoSection'
import { ComposurePool, DodgePool, JudgeIntentPool, LiftPool, MemoryPool, ResistDamagePool } from '../../DicePools'

export const DicePoolsSection: FC = () => {
  return <InfoSection>
    <Typography variant={'h6'}>Dice Pools</Typography>
    <DicePools>
      <DodgePool />
      <ResistDamagePool />
      <ComposurePool />
      <JudgeIntentPool />
      <MemoryPool />
      <LiftPool />
    </DicePools>
  </InfoSection>
}
