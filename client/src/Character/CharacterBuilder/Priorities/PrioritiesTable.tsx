import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { FC, useState } from 'react'

import { AwakenedType } from '../../AwakenedType'
import { MetatypeId } from '../../Metatype'
import { PriorityStat, PriorityValues, priorityValues } from './Priorities'
import { PriorityRow } from './PriorityRow'

export type SelectedPriorities = Record<string, PriorityStat>

interface PrioritiesTableProps {
  metatypeId: MetatypeId
  awakened: AwakenedType

  onChange (priorities: PriorityValues): void
}

export const PrioritiesTable: FC<PrioritiesTableProps> = ({
  metatypeId,
  awakened,
  onChange,
}) => {
  const [selectedPriorities, setSelectedPriorities] = useState<SelectedPriorities>({})

  const onPriorityChange = (level: string, stat: PriorityStat) => {
    const priorities = { ...selectedPriorities }

    Object.entries(priorities)
      .filter(priority => priority[1] === stat)
      .map(priority => priority[0])
      .forEach(oldLevel => priorities[oldLevel] = priorities[level])

    priorities[level] = stat

    setSelectedPriorities(priorities)
    onChange(toPriorityValues(priorities))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center">Priority</TableCell>
            <TableCell variant="head" align="center">Metatype</TableCell>
            <TableCell variant="head" align="center">Attributes</TableCell>
            <TableCell variant="head" align="center">Skills</TableCell>
            <TableCell variant="head" align="center">
              {awakened === AwakenedType.Technomancer ? 'Resonance' : 'Magic'}
            </TableCell>
            <TableCell variant="head" align="center">Resources</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.entries(priorityValues).map(([level, values]) => (
            <PriorityRow
              key={level}
              level={level}
              values={values}
              selectedType={selectedPriorities[level]}
              onSelect={onPriorityChange}
              metatypeId={metatypeId}
              awakened={awakened}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export function toPriorityValues (selectedPriorities: SelectedPriorities): PriorityValues {
  const values: PriorityValues = {
    metatypes: [],
    adjustmentPoints: 0,
    attributePoints: 0,
    skillPoints: 0,
    magic: 0,
    nuyen: 0,
  }

  for (const [level, stat] of Object.entries(selectedPriorities)) {
    const levelValues = priorityValues[level]

    switch (stat) {
      case PriorityStat.metatype:
        values.metatypes = levelValues.metatypes
        values.adjustmentPoints = levelValues.adjustmentPoints
        break
      case PriorityStat.attributes:
        values.attributePoints = levelValues.attributePoints
        break
      case PriorityStat.skills:
        values.skillPoints = levelValues.skillPoints
        break
      case PriorityStat.magic:
        values.magic = levelValues.magic
        break
      case PriorityStat.nuyen:
        values.nuyen = levelValues.nuyen
        break
    }
  }

  return values
}
