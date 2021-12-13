import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { FC, useState } from 'react'

import { AwakenedType } from '../../AwakenedType'
import { CharacterAttr } from '../../CharacterAttr'
import { CharAttributes } from '../../CharacterData'
import { MetatypeId, Metatypes } from '../../Metatype'
import { AttrTableRow } from './AttrTableRow'

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
  metatypeId: MetatypeId
  awakened: AwakenedType
  attributePoints: number
  adjustmentPoints: number
  magic: number

  onChange (attributes: CharAttributes): void
}

export const AttributesTable: FC<AttributesTableProps> = ({
  metatypeId,
  awakened,
  attributePoints,
  adjustmentPoints,
  magic,
  onChange,
}) => {
  const [adjPointsSpent, setAdjPointsSpent] = useState<CharAttributes>(defaultAttributes)
  const [pointsSpent, setPointsSpent] = useState<CharAttributes>(defaultAttributes)
  const [karmaPoints, setKarmaPoints] = useState<CharAttributes>(defaultAttributes)

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

  const excludedAttributes: CharacterAttr[] = [
    CharacterAttr.essence,
  ]

  switch (awakened) {
    case AwakenedType.Technomancer:
      base[CharacterAttr.resonance] = magic
      excludedAttributes.push(CharacterAttr.magic)
      break
    case AwakenedType.Aspected:
      base[CharacterAttr.magic] = magic + 1
      excludedAttributes.push(CharacterAttr.resonance)
      break
    case AwakenedType.Mundane:
      excludedAttributes.push(CharacterAttr.magic)
      excludedAttributes.push(CharacterAttr.resonance)
      break
    default:
      base[CharacterAttr.magic] = magic
      excludedAttributes.push(CharacterAttr.resonance)
  }

  const totalAdjPointsSpent = Object.entries(adjPointsSpent)
    .map(([attr, rank]) => ({ attr: attr as CharacterAttr, rank }))
    .filter(({ attr }) => !excludedAttributes.includes(attr))
    .map(({ rank }) => rank)
    .reduce((sum: number, points: number) => sum + points)

  const totalPointsSpent = Object.entries(pointsSpent)
    .map(([attr, rank]) => ({ attr: attr as CharacterAttr, rank }))
    .filter(({ attr }) => !excludedAttributes.includes(attr))
    .map(({ rank }) => rank)
    .reduce((sum: number, points: number) => sum + points)

  const totalKarmaCost = calcKaramaCost(karmaPoints, mergePointLists([
    adjPointsSpent,
    pointsSpent,
    base,
  ]))

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell>
              Attribute
            </TableCell>
            <TableCell>
              Max
            </TableCell>
            <TableCell>
              Base
            </TableCell>
            <TableCell sx={{ color: totalAdjPointsSpent > adjustmentPoints ? 'error.main' : undefined }}>
              Metatype ({totalAdjPointsSpent}/{adjustmentPoints})
            </TableCell>
            <TableCell sx={{ color: totalPointsSpent > attributePoints ? 'error.main' : undefined }}>
              Points ({totalPointsSpent}/{attributePoints})
            </TableCell>
            <TableCell>
              Karma ({totalKarmaCost} Karma)
            </TableCell>
            <TableCell>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(Object.keys(base) as CharacterAttr[])
            .filter(attribute => !excludedAttributes.includes(attribute))
            .map(attribute => (
              <AttrTableRow
                key={attribute}
                attribute={attribute}
                base={base[attribute]}
                adjPoints={adjPointsSpent[attribute]}
                attrPoints={pointsSpent[attribute]}
                karmaPoints={karmaPoints[attribute]}
                maximum={Metatypes[metatypeId].attrMaximums[attribute]}
                onAdjPointsChange={value => setAdjPointsSpent({ ...adjPointsSpent, [attribute]: value })}
                onAttrPointsChange={value => setPointsSpent({ ...pointsSpent, [attribute]: value })}
                onKarmaPointsChange={value => setKarmaPoints({ ...karmaPoints, [attribute]: value })}
              />
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

function calcKaramaCost (karmaPoints: CharAttributes, preKarma: CharAttributes) {
  return Object.entries(preKarma)
    .map(([attr, rank]) => ({ attr: attr as CharacterAttr, rank }))
    .filter(({ rank }) => rank && rank !== 0)
    .map(({ attr, rank }): number => {
      let cost = 0
      let points = karmaPoints[attr] || 0

      while (points >= 1) {
        cost += (rank + 1) * 5
        rank += 1
        points -= 1
      }

      return cost
    })
    .reduce((sum, cost) => sum + cost)
}
