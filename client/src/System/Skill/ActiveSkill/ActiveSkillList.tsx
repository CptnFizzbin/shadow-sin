import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { FC } from 'react'

import { formatAttr } from '../../Attribute'
import { useAttribute } from '../../AttributeProvider'
import { ActiveSkillData } from './ActiveSkillData'

interface SkillListProps {
  skills: ActiveSkillData[]
}

export const ActiveSkillList: FC<SkillListProps> = ({
  skills,
}) => {
  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Rank</TableCell>
          <TableCell colSpan={2}>Attr</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {skills.map(skill => (
          <SkillListRow key={skill.name} skill={skill} />
        ))}
      </TableBody>
    </Table>
  )
}

interface SkillListRowProps {
  skill: ActiveSkillData
}

const SkillListRow: FC<SkillListRowProps> = ({
  skill,
}) => {
  const attrValue = useAttribute(skill.attr) || 0
  const altAttrValue = useAttribute(skill.altAttr || '') || 0

  return (
    <TableRow key={skill.name}>
      <TableCell>
        <div>{skill.name}</div>
        {skill.speciality && <div>(S. {skill.speciality})</div>}
        {skill.expertise && <div>(E. {skill.expertise})</div>}
      </TableCell>
      <TableCell>
        {skill.rank}
      </TableCell>
      <TableCell>
        <div>{formatAttr(skill.attr)}</div>
        {skill.altAttr && <div>{formatAttr(skill.altAttr)}</div>}
      </TableCell>
      <TableCell>
        <div>{attrValue}</div>
        {skill.altAttr && <div>{altAttrValue}</div>}
      </TableCell>
    </TableRow>
  )
}
