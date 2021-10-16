import { MenuItem, Stack, TextField } from '@mui/material'
import { FC } from 'react'

import { BioData } from '../CharacterData'

interface BioSectionProps {
  bio: BioData
  metatypes: string[]

  onChange (bio: BioData): void
}

export const BioSection: FC<BioSectionProps> = ({
  bio,
  metatypes,
  onChange,
}) => {
  const showMetaTypeWarning = bio.metatype
    && metatypes.length >= 0
    && !metatypes.includes(bio.metatype)

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1}>
        <TextField
          variant="standard"
          label="Alias"
          fullWidth
          value={bio.alias}
          onChange={event => onChange({ ...bio, alias: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Name"
          fullWidth
          value={bio.name}
          onChange={event => onChange({ ...bio, name: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Metatype"
          fullWidth
          select value={bio.metatype}
          onChange={event => onChange({ ...bio, metatype: event.target.value })}
          focused={!!showMetaTypeWarning}
          color={showMetaTypeWarning ? 'warning' : undefined}
          helperText={showMetaTypeWarning ? 'Metatype unavailable at current priority' : undefined}
        >
          {['Dwarf', 'Elf', 'Human', 'Ork', 'Troll'].map(metatype => (
            <MenuItem key={metatype} value={metatype}>{metatype}</MenuItem>
          ))}
        </TextField>

        <TextField
          variant="standard"
          label="Role"
          fullWidth
          value={bio.role}
          onChange={event => onChange({ ...bio, role: event.target.value })}
        />
      </Stack>

      <Stack direction="row" gap={1}>
        <TextField
          variant="standard"
          label="Ethnicity"
          fullWidth
          value={bio.ethnicity}
          onChange={event => onChange({ ...bio, ethnicity: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Age"
          fullWidth
          value={bio.age}
          onChange={event => onChange({ ...bio, age: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Gender"
          fullWidth
          value={bio.gender}
          onChange={event => onChange({ ...bio, gender: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Height"
          fullWidth
          value={bio.height}
          onChange={event => onChange({ ...bio, height: event.target.value })}
        />

        <TextField
          variant="standard"
          label="Weight"
          fullWidth
          value={bio.weight}
          onChange={event => onChange({ ...bio, weight: event.target.value })}
        />
      </Stack>
    </Stack>
  )
}
