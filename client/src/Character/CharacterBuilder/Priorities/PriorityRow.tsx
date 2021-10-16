import { TableCell, TableRow } from '@mui/material'
import { FC } from 'react'

import { formatNuyen } from '../../../System/Nuyen'
import { PriorityStat, PriorityValues } from './Priorities'

interface PriorityRowProps {
  level: string
  values: PriorityValues
  selectedType?: PriorityStat

  onSelect (level: string, type: PriorityStat): void
}

export const PriorityRow: FC<PriorityRowProps> = ({
  level,
  values,
  selectedType,
  onSelect,
}) => {
  return (
    <TableRow
      sx={{
        '& .MuiTableCell-root:hover, & .MuiTableCell-body.selected': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      <TableCell>{level}</TableCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.metatype)}
        selected={selectedType === PriorityStat.metatype}
      >
        {values.metatypes.join(', ')} ({values.adjustmentPoints})
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.attributes)}
        selected={selectedType === PriorityStat.attributes}
      >
        {values.attributePoints}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.skills)}
        selected={selectedType === PriorityStat.skills}
      >
        {values.skillPoints}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.magic)}
        selected={selectedType === PriorityStat.magic}
      >
        {values.magic === 0 ? (
          'Mundane'
        ) : (
          <>
            <div>Full: {values.magic} Magic</div>
            <div>Aspected: {values.magic + 1} Magic</div>
            <div>Mystic Adept: {values.magic} Magic</div>
            <div>Adept: {values.magic} Magic</div>
            <div>Technomancer: {values.magic} Resonance</div>
          </>
        )}
      </PriorityCell>
      <PriorityCell
        onClick={() => onSelect(level, PriorityStat.nuyen)}
        selected={selectedType === PriorityStat.nuyen}
      >
        {formatNuyen(values.nuyen)}
      </PriorityCell>
    </TableRow>
  )
}

interface PriorityCellProps {
  selected?: boolean

  onClick (): void
}

export const PriorityCell: FC<PriorityCellProps> = ({
  selected,
  onClick,
  children,
}) => {
  return (
    <TableCell onClick={onClick} className={selected ? 'selected' : ''}>{children}
    </TableCell>
  )
}
