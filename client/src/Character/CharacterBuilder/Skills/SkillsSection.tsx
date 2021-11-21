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
import { ActiveSkill } from '../../../System/Skill/ActiveSkill/ActiveSkillId'
import { SkillType } from '../../../System/Skill/SkillData'
import { Incrementor } from '../../../UI/Incrementor'

export const SkillsSection: FC = () => {
  const [skills, setSkills] = useState<ActiveSkillData[]>([])

  const availableSkills: ActiveSkill[] = Object.values(ActiveSkill)
    .filter(skillId => !skills.map(skill => skill.name).includes(skillId))

  const onAddSkill = (skillId: ActiveSkill) => {
    setSkills([
      ...skills, {
        type: SkillType.active, name: skillId, rank: 0, attr: '',
      }])
  }

  const onRemoveSkill = (skillId: ActiveSkill) => {
    setSkills(skills.filter(skill => skill.name !== skillId))
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center" />
            <TableCell variant="head" align="center" width={'33%'}>Skill</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Rank</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Specialty</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {skills.map(skill => (
            <SkillsTableRow
              key={skill.name}
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
                onChange={event => onAddSkill(event.target.value as ActiveSkill)}
              >
                {availableSkills.map(skillName => (
                  <MenuItem key={skillName} value={skillName}>{skillName}</MenuItem>
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

  onRemove (skillId: ActiveSkill): void
}

const SkillsTableRow: FC<SkillsTableRowProps> = ({
  skill,
  onRemove,
}) => {
  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => onRemove(skill.name)}>
          <RemoveCircle />
        </IconButton>
      </TableCell>
      <TableCell>
        {skill.name}
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
