import { FC } from 'react'

import { Stat } from '../../UI/StatBlock'

export type Cost = number

interface CostProps {
  cost: Cost
}

const costFormatter = new Intl.NumberFormat('en')
export const CostStat: FC<CostProps> = ({
  cost,
}) => {
  return (
    <Stat name="Cost" value={formatCost(cost)} />
  )
}

export const formatCost = (cost: number): string => {
  return costFormatter.format(cost) + '¥'
}
