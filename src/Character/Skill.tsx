import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { FC } from 'react'

import { Attribute } from './Attribute'
import { CharacterData } from './CharacterData'

export type SkillId = string;

export interface BasicSkill {
  type: string
  id: SkillId
  name: string
}

export interface StatSkill extends BasicSkill {
  type: 'stat'
  rank: number
  attr: Attribute
  altAttr?: Attribute
  speciality: string | null
  expertise: string | null
}

export interface LanguageSkill extends BasicSkill {
  type: 'language'
  rank: string
}

export interface KnowledgeSkill extends BasicSkill {
  type: 'knowledge'
  rank: string
}

export type Skill = StatSkill | LanguageSkill | KnowledgeSkill

interface SkillListProps {
  character: CharacterData
}

export const SkillList: FC<SkillListProps> = ({
  character,
}) => {
  return (
    <>
      <Typography variant={'h5'}>Skills</Typography>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Rank</TableCell>
            <TableCell>Attr</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {character.skills.map(skill => (
            <SkillListRow key={skill.id} skill={skill} />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

interface SkillListRowProps {
  skill: Skill
}

const SkillListRow: FC<SkillListRowProps> = ({
  skill,
}) => {
  let name = skill.name

  switch (skill.type) {
  case 'stat':
    if (skill.speciality) {
      name += ` (s. ${skill.speciality})`
    }
    if (skill.expertise) {
      name += ` (e. ${skill.expertise})`
    }
  }

  return (
    <TableRow key={skill.id}>
      <TableCell>{name}</TableCell>
      <TableCell>{skill.rank}</TableCell>
      <TableCell>
        {skill.type === 'stat' && (
          <>
            {skill.attr ? skill.attr : null}
            {skill.altAttr ? `/${skill.altAttr}` : null}
          </>
        )}
      </TableCell>
    </TableRow>
  )
}
