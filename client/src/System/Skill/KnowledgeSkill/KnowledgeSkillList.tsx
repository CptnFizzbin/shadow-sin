import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import { FC } from 'react'

import { KnowledgeSkillData } from './KnowledgeSkillData'

interface SkillListProps {
  skills: KnowledgeSkillData[]
}

export const KnowledgeSkillList: FC<SkillListProps> = ({
  skills,
}) => {
  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {skills.map(skill => <SkillListRow key={skill.name} skill={skill} />)}
      </TableBody>
    </Table>
  )
}

interface SkillListRowProps {
  skill: KnowledgeSkillData
}

const SkillListRow: FC<SkillListRowProps> = ({
  skill,
}) => {
  return (
    <TableRow key={skill.name}>
      <TableCell colSpan={3}>{skill.name}</TableCell>
    </TableRow>
  )
}
