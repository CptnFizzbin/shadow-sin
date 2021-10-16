import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { FC, useState } from 'react'

import { formatAttr } from '../../../System/Attribute'
import { Incrementor } from '../../../UI/Incrementor'
import { AwakenedType } from '../../AwakenedType'
import { CharacterAttr } from '../../CharacterAttr'
import { CharAttributes } from '../../CharacterData'
import { Metatype } from '../../Metatypes'
import { metatypeMaximums } from './metatypeMaximums'

const defaultAttributes: CharAttributes = {
  [CharacterAttr.body]: 0,
  [CharacterAttr.agility]: 0,
  [CharacterAttr.reaction]: 0,
  [CharacterAttr.strength]: 0,
  [CharacterAttr.willpower]: 0,
  [CharacterAttr.logic]: 0,
  [CharacterAttr.intuition]: 0,
  [CharacterAttr.charisma]: 0,
  [CharacterAttr.edge]: 0,
  [CharacterAttr.magic]: 0,
  [CharacterAttr.resonance]: 0,
  [CharacterAttr.essence]: 0,
}

interface AttributesTableProps {
  metatype: Metatype
  awakened: AwakenedType
  attributePoints: number
  adjustmentPoints: number
  magic: number

  onChange (attributes: CharAttributes): void
}

export const AttributesTable: FC<AttributesTableProps> = ({
  metatype,
  awakened,
  attributePoints,
  adjustmentPoints,
  magic,
  onChange,
}) => {
  const attributeMaximums = metatypeMaximums[metatype]
  const [adjPointsSpent, setAdjPointsSpent] = useState<CharAttributes>(defaultAttributes)
  const [pointsSpent, setPointsSpent] = useState<CharAttributes>(defaultAttributes)
  const [karmaPoints, setKarmaPoints] = useState<CharAttributes>(defaultAttributes)

  const totalAdjPointsSpent = (Object.values(adjPointsSpent) as number[])
    .reduce((sum: number, points: number) => sum + points)

  const totalPointsSpent = (Object.values(pointsSpent) as number[])
    .reduce((sum: number, points: number) => sum + points)

  const base: CharAttributes = {
    [CharacterAttr.body]: 1,
    [CharacterAttr.agility]: 1,
    [CharacterAttr.reaction]: 1,
    [CharacterAttr.strength]: 1,
    [CharacterAttr.willpower]: 1,
    [CharacterAttr.logic]: 1,
    [CharacterAttr.intuition]: 1,
    [CharacterAttr.charisma]: 1,
    [CharacterAttr.edge]: 1,
    [CharacterAttr.magic]: 0,
    [CharacterAttr.resonance]: 0,
    [CharacterAttr.essence]: 0,
  }

  switch (awakened) {
    case AwakenedType.Technomancer:
      base[CharacterAttr.resonance] = magic
      break
    case AwakenedType.Aspected:
      base[CharacterAttr.magic] = magic + 1
      break
    case AwakenedType.Mundane:
      break
    default:
      base[CharacterAttr.magic] = magic
  }

  const totalPreKarma = mergePointLists([base, pointsSpent, adjPointsSpent])
  const totalKarmaCost = Object.entries(totalPreKarma)
    .map(([attr, rank]): number => {
      if (!rank) return 0

      let cost = 0
      let points = karmaPoints[attr as CharacterAttr] || 0

      while (points >= 1) {
        cost += (rank + 1) * 5
        rank += 1
        points -= 1
      }

      return cost
    })
    .reduce((sum, cost) => sum + cost)

  const total = mergePointLists([totalPreKarma, karmaPoints])

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Attribute</TableCell>
            <TableCell>Base</TableCell>
            <TableCell>Adjustment ({totalAdjPointsSpent} / {adjustmentPoints})</TableCell>
            <TableCell>Points ({totalPointsSpent} / {attributePoints})</TableCell>
            <TableCell>Karma ({totalKarmaCost} Karma)</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Object.keys(base) as CharacterAttr[]).map(attribute => (
            <TableRow key={attribute}>
              <TableCell>
                {formatAttr(attribute)}
              </TableCell>
              <TableCell>
                {base[attribute]}
              </TableCell>
              <TableCell>
                {((typeof attributeMaximums[attribute] === 'number' && attributeMaximums[attribute] as number >= 7)
                  || [CharacterAttr.edge, CharacterAttr.magic, CharacterAttr.resonance].includes(attribute)) ? (
                    <Incrementor
                      min={0}
                      value={adjPointsSpent[attribute] as number}
                      onChange={value => setAdjPointsSpent({ ...adjPointsSpent, [attribute]: value })}
                    />
                  ) : (
                    '-'
                  )}
              </TableCell>
              <TableCell>
                <Incrementor
                  min={0}
                  value={pointsSpent[attribute] as number}
                  onChange={value => setPointsSpent({ ...pointsSpent, [attribute]: value })}
                />
              </TableCell>
              <TableCell>
                <Incrementor
                  min={0}
                  value={karmaPoints[attribute] as number}
                  onChange={value => setKarmaPoints({ ...karmaPoints, [attribute]: value })}
                />
              </TableCell>
              <TableCell>
                {total[attribute]} / {attributeMaximums[attribute]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function mergePointLists (lists: CharAttributes[]): CharAttributes {
  return lists.reduce((total, points) => {
    for (const attribute of Object.values(CharacterAttr) as CharacterAttr[]) {
      total = { ...total, [attribute]: (total[attribute] as number) + (points[attribute] as number) }
    }

    return total
  })
}
