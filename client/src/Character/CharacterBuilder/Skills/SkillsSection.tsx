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

import { ActiveSkill, ActiveSkillName, activeSkills, CharacterActiveSkill, SkillType } from '../../../Skills'
import { Incrementor } from '../../../UI/Incrementor'

export const SkillsSection: FC = () => {
  const [charSkills, setCharSkills] = useState<Record<string, CharacterActiveSkill>>({})

  const availableSkills: ActiveSkill[] = Object.values(activeSkills)
    .filter(skill => !Object.keys(charSkills).includes(skill.name))

  const onAddSkill = (skill: ActiveSkillName) => {
    setCharSkills({
      ...charSkills,
      [skill]: {
        type: SkillType.active,
        name: skill,
        rank: 0,
      },
    })
  }

  const onRemoveSkill = (skill: ActiveSkillName) => {
    const skills = { ...charSkills }
    delete skills[skill]
    setCharSkills(skills)
  }

  const onChangeSkill = (skill: CharacterActiveSkill) => {
    setCharSkills({
      ...charSkills,
      [skill.name]: skill,
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center" />
            <TableCell variant="head" align="center" width={'33%'}>Skill</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Rank</TableCell>
            <TableCell variant="head" align="center" width={'33%'}>Specialization</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(charSkills).map(charSkill => (
            <SkillsTableRow
              key={charSkill.name}
              charSkill={charSkill}
              onRemove={(skill) => onRemoveSkill(skill.name)}
              onChange={(skill) => onChangeSkill(skill)}
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
                onChange={event => onAddSkill(event.target.value as ActiveSkillName)}
              >
                {availableSkills.map(skill => (
                  <MenuItem key={skill.name} value={skill.name}>{skill.name}</MenuItem>
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
  charSkill: CharacterActiveSkill

  onChange (charSkill: CharacterActiveSkill): void

  onRemove (charSkill: CharacterActiveSkill): void
}

const SkillsTableRow: FC<SkillsTableRowProps> = ({
  charSkill,
  onChange,
  onRemove,
}) => {
  const activeSkill = activeSkills[charSkill.name]

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => onRemove(charSkill)}>
          <RemoveCircle />
        </IconButton>
      </TableCell>
      <TableCell>
        {activeSkill.name}
      </TableCell>
      <TableCell>
        <Incrementor
          value={charSkill.rank}
          onChange={(rank) => onChange({ ...charSkill, rank })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant={'standard'}
          value={charSkill.specialization}
          onChange={(event) =>
            onChange({ ...charSkill, specialization: event.target.value })
          }
        />
      </TableCell>
    </TableRow>
  )
}
