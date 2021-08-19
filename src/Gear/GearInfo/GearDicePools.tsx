import { FC } from 'react'

import { DicePools } from '../../UI/DicePool'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'

export const GearDicePools: FC = ({
  children,
}) => {
  return (
    <InfoSection>
      <DicePools>{children}</DicePools>
    </InfoSection>
  )
}
