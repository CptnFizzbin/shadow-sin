import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Autocomplete,
  IconButton,
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

import { ActiveSkill, ActiveSkillId, ActiveSkills, CharacterActiveSkill, SkillType } from '../../../Skills'
import { formatAttr } from '../../../System/Attribute'
import { Incrementor } from '../../../UI/Incrementor'

export const SkillsSection: FC = () => {
  const [charSkills, setCharSkills] = useState<Record<ActiveSkillId, CharacterActiveSkill>>({})

  const availableSkills: ActiveSkill[] = Object.values(ActiveSkills)
    .filter(skill => !Object.keys(charSkills).includes(skill.name))

  const onAddSkill = (skillId: ActiveSkillId) => {
    setCharSkills({
      ...charSkills,
      [skillId]: { type: SkillType.active, id: skillId, rank: 1 },
    })
  }

  const onRemoveSkill = (skill: ActiveSkillId) => {
    const skills = { ...charSkills }
    delete skills[skill]
    setCharSkills(skills)
  }

  const onChangeSkill = (skill: CharacterActiveSkill) => {
    setCharSkills({
      ...charSkills,
      [skill.id]: skill,
    })
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ '& th, & td': { textAlign: 'center' } }}>
        <TableHead>
          <TableRow>
            <TableCell variant="head" align="center" />
            <TableCell variant="head" align="center">Skill</TableCell>
            <TableCell variant="head" align="center">Attr</TableCell>
            <TableCell variant="head" align="center">Rank</TableCell>
            <TableCell variant="head" align="center">Specialization</TableCell>
            <TableCell variant="head" align="center">Expertise</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {Object.values(charSkills).map(charSkill => (
            <SkillsTableRow
              key={charSkill.id}
              charSkill={charSkill}
              onRemove={(skill) => onRemoveSkill(skill.id)}
              onChange={(skill) => onChangeSkill(skill)}
            />
          ))}

          <TableRow>
            <TableCell colSpan={2}>
              <Autocomplete
                autoComplete
                includeInputInList
                blurOnSelect
                clearOnBlur
                value={null}
                onChange={(_, skillId: ActiveSkillId | null) => skillId && onAddSkill(skillId)}
                options={availableSkills.map(skill => skill.name)}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder={'Add Skill'}
                    variant={'standard'}
                  />
                )}
              />
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
  const activeSkill = ActiveSkills[charSkill.id]

  return (
    <TableRow>
      <TableCell>
        <IconButton onClick={() => onRemove(charSkill)}>
          <FontAwesomeIcon icon={faMinusCircle} />
        </IconButton>
      </TableCell>
      <TableCell>
        {activeSkill.name}
      </TableCell>
      <TableCell>
        {formatAttr(activeSkill.attr)}
        {activeSkill.altAttr && ', ' + formatAttr(activeSkill.altAttr)}
      </TableCell>
      <TableCell>
        <Incrementor
          min={1}
          value={charSkill.rank}
          onChange={(rank) => onChange({ ...charSkill, rank })}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant={'standard'}
          value={charSkill.specialization}
          placeholder={'None'}
          onChange={(event) =>
            onChange({ ...charSkill, specialization: event.target.value })
          }
        />
      </TableCell>
      <TableCell>
        <TextField
          variant={'standard'}
          value={charSkill.expertise}
          placeholder={'None'}
          onChange={(event) =>
            onChange({ ...charSkill, expertise: event.target.value })
          }
        />
      </TableCell>
    </TableRow>
  )
}
