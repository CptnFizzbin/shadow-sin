import { Add, RemoveCircle } from '@mui/icons-material'
import {
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { FC, useState } from 'react'

import { noOp } from '../../../Helpers'
import { ActiveSkillData } from '../../../System/Skill/ActiveSkill/ActiveSkillData'
import { ActiveSkillId, formatSkill } from '../../../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../../../System/Skill/SkillData'
import { Incrementor } from '../../../UI/Incrementor'

interface SkillsSectionProps {
  foo?: boolean
}

export const SkillsSection: FC<SkillsSectionProps> = ({
  foo,
}) => {
  const [skills, setSkills] = useState<ActiveSkillData[]>([])

  const availableSkillIds: ActiveSkillId[] = Object.values(ActiveSkillId)
    .filter(skillId => !skills.map(skill => skill.skillId).includes(skillId))

  const onAddSkill = (skillId: ActiveSkillId) => {
    setSkills([
      ...skills, {
        type: SkillType.active, skillId, rank: 0, attr: '',
      }])
  }

  const onRemoveSkill = (skillId: ActiveSkillId) => {
    setSkills(skills.filter(skill => skill.skillId !== skillId))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center"/>
            <TableCell variant="head" align="center" width={'33%'}>Skill</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Rank</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Specialty</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {skills.map(skill => (
            <SkillsTableRow
              key={skill.skillId}
              skill={skill}
              onRemove={onRemoveSkill}
            />
          ))}

          <TableRow>
            <TableCell>
              <Add />
            </TableCell>

            <TableCell>
              <TextField
                variant={'standard'}
                select
                fullWidth
                value={''}
                onChange={event => onAddSkill(event.target.value as ActiveSkillId)}
              >
                {availableSkillIds.map(skillId => (
                  <MenuItem key={skillId} value={skillId}>{formatSkill(skillId)}</MenuItem>
                ))}
              </TextField>
            </TableCell>

            <TableCell colSpan={2} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

interface SkillsTableRowProps {
  skill: ActiveSkillData

  onRemove (skillId: ActiveSkillId): void
}

const SkillsTableRow: FC<SkillsTableRowProps> = ({
  skill,
  onRemove,
}) => {
  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => onRemove(skill.skillId)}>
          <RemoveCircle />
        </IconButton>
      </TableCell>
      <TableCell>
        {formatSkill(skill.skillId)}
      </TableCell>
      <TableCell>
        <Incrementor value={0} onChange={noOp} />
      </TableCell>
      <TableCell>
        <TextField variant={'standard'} />
      </TableCell>
    </TableRow>
  )
}
