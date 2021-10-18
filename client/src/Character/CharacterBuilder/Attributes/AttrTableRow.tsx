import { TableCell, TableRow } from '@mui/material'
import { FC } from 'react'

import { formatAttr } from '../../../System/Attribute'
import { Incrementor } from '../../../UI/Incrementor'
import { CharacterAttr, specialAttrs } from '../../CharacterAttr'

interface AttrTableRowProps {
  attribute: CharacterAttr
  base: number
  adjPoints: number
  attrPoints: number
  karmaPoints: number
  maximum: number

  onAdjPointsChange (value: number): void

  onAttrPointsChange (value: number): void

  onKarmaPointsChange (value: number): void
}

export const AttrTableRow: FC<AttrTableRowProps> = ({
  attribute,
  base,
  adjPoints,
  attrPoints,
  karmaPoints,
  maximum,
  onAdjPointsChange,
  onAttrPointsChange,
  onKarmaPointsChange,
}) => {
  const allowAdjPoints = maximum >= 7 || specialAttrs.includes(attribute)
  const total = base + adjPoints + attrPoints + karmaPoints

  return (
    <TableRow>
      <TableCell>
        {formatAttr(attribute)}
      </TableCell>
      <TableCell sx={{ color: total > maximum ? 'error.main' : undefined }}>
        {maximum}
      </TableCell>
      <TableCell>
        {base}
      </TableCell>
      <TableCell>
        <AttrIncrementor disabled={!allowAdjPoints} value={adjPoints} onChange={onAdjPointsChange} />
      </TableCell>
      <TableCell>
        <AttrIncrementor value={attrPoints} onChange={onAttrPointsChange} />
      </TableCell>
      <TableCell>
        <AttrIncrementor value={karmaPoints} onChange={onKarmaPointsChange} />
      </TableCell>
      <TableCell sx={{ color: total > maximum ? 'error.main' : undefined }}>
        {total}
      </TableCell>
    </TableRow>
  )
}

interface AttrIncrementorProps {
  disabled?: boolean
  value: number

  onChange (value: number): void
}

const AttrIncrementor: FC<AttrIncrementorProps> = ({
  disabled,
  value,
  onChange,
}) => {
  if (disabled) return <>-</>
  return <Incrementor min={0} value={value} onChange={onChange} />
}
