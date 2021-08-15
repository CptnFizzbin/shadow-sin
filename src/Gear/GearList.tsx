import { FC } from 'react'

import { GearData } from './GearData'
import { GearInfo } from './GearInfo'

interface GearListProps {
  gear: GearData[]
}

export const GearList: FC<GearListProps> = ({
  gear,
}) => {
  return (
    <>
      {gear.map(gear => <GearInfo key={gear.id} gear={gear} />)}
    </>
  )
}
