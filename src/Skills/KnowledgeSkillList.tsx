import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { FC } from "react"

import { CharacterKnowledgeSkill } from "./CharacterSkill"

interface SkillListProps {
  skills: CharacterKnowledgeSkill[]
}

export const KnowledgeSkillList: FC<SkillListProps> = ({ skills }) => {
  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {skills.map((skill) => (
          <SkillListRow key={skill.name} skill={skill} />
        ))}
      </TableBody>
    </Table>
  )
}

interface SkillListRowProps {
  skill: CharacterKnowledgeSkill
}

const SkillListRow: FC<SkillListRowProps> = ({ skill }) => {
  return (
    <TableRow key={skill.name}>
      <TableCell colSpan={3}>{skill.name}</TableCell>
    </TableRow>
  )
}
